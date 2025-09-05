import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import stagesData from "@/data/stages.json";

const applicationSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  prenoms: z.string().min(2, "Les prénoms sont requis"),
  sexe: z.enum(["masculin", "feminin"], { required_error: "Le sexe est requis" }),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(10, "Numéro de téléphone requis"),
  ecole: z.string().min(2, "L'école est requise"),
  universite: z.string().optional(),
  filiere: z.string().min(2, "La filière est requise"),
  annee_etude: z.string().min(1, "L'année d'étude est requise"),
  temps_stage: z.string().min(1, "La durée du stage est requise"),
  date_debut: z.string().min(1, "La date de début est requise"),
  lettre_motivation: z.string().min(50, "La lettre de motivation doit contenir au moins 50 caractères"),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function StageApplication() {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lettreDemandeFile, setLettreDemandeFile] = useState<File | null>(null);

  const stage = stagesData.find(s => s.id === stageId);

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      nom: "",
      prenoms: "",
      email: "",
      telephone: "",
      ecole: "",
      universite: "",
      filiere: "",
      annee_etude: "",
      temps_stage: "",
      date_debut: "",
      lettre_motivation: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Erreur",
          description: "Seuls les fichiers PDF sont acceptés",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erreur",
          description: "Le fichier ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }
      setLettreDemandeFile(file);
    }
  };

  const uploadFile = async (file: File, applicationId: string): Promise<string | null> => {
    try {
      console.log('Attempting to upload file:', file.name, 'for application:', applicationId);
      
      // Nettoyer le nom de fichier pour éviter les erreurs InvalidKey
      const sanitizedFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
      
      const fileName = `${applicationId}/${sanitizedFileName}`;
      console.log('Sanitized filename:', fileName);
      
      const { data, error } = await supabase.storage
        .from('stage-documents')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error details:', error);
        throw new Error(`Erreur d'upload: ${error.message}`);
      }

      if (!data?.path) {
        throw new Error('Aucun chemin de fichier retourné après upload');
      }

      console.log('File uploaded successfully:', data.path);
      return data.path;
    } catch (error) {
      console.error('Upload function error:', error);
      throw error;
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    console.log('Starting form submission...');
    
    if (!stageId || !stage) {
      console.error('Stage not found:', { stageId, stage });
      toast({
        title: "Erreur",
        description: "Stage non trouvé",
        variant: "destructive",
      });
      return;
    }

    if (!lettreDemandeFile) {
      console.error('No file selected');
      toast({
        title: "Erreur",
        description: "La lettre de demande de stage est requise",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating application record...');
      
      // Formatage de la date pour la base de données
      const formattedDate = data.date_debut ? new Date(data.date_debut).toISOString() : null;

      // First create the application to get an ID
      const { data: application, error: insertError } = await supabase
        .from('applications')
        .insert({
          stage_id: stageId,
          nom: data.nom,
          prenoms: data.prenoms,
          sexe: data.sexe,
          email: data.email,
          telephone: data.telephone,
          ecole: data.ecole,
          universite: data.universite || null,
          filiere: data.filiere,
          annee_etude: data.annee_etude,
          temps_stage: data.temps_stage,
          date_debut: formattedDate,
          lettre_motivation: data.lettre_motivation,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`Erreur lors de la création de la candidature: ${insertError.message}`);
      }

      if (!application) {
        throw new Error('Aucune candidature créée');
      }

      console.log('Application created successfully:', application.id);

      // Upload the file
      try {
        const filePath = await uploadFile(lettreDemandeFile, application.id);
        
        console.log('Updating application with file path:', filePath);
        
        // Update the application with the file path
        const { error: updateError } = await supabase
          .from('applications')
          .update({ lettre_demande_url: filePath })
          .eq('id', application.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw new Error(`Erreur lors de la mise à jour: ${updateError.message}`);
        }

        console.log('Application updated successfully with file path');

        // Send email notification
        try {
          console.log('Calling email function...');
          
          // Préparer les données pour l'email
          const emailData = {
            application: {
              ...application,
              lettre_demande_url: filePath,
              date_debut: data.date_debut, // Garder le format original pour l'email
              created_at: new Date().toISOString()
            },
            stage: stage
          };

          console.log('Sending email with data:', emailData);

          const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-application-email', {
            body: JSON.stringify(emailData),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (emailError) {
            console.error('Email function error:', emailError);
            toast({
              title: "Candidature enregistrée",
              description: "Votre candidature a été enregistrée mais l'email de notification n'a pas pu être envoyé.",
              variant: "default",
            });
          } else {
            console.log('Email sent successfully:', emailResponse);
            toast({
              title: "Candidature envoyée !",
              description: "Votre candidature a été envoyée avec succès à l'entreprise.",
            });
          }
        } catch (emailErr) {
          console.error('Email function call failed:', emailErr);
          toast({
            title: "Candidature enregistrée",
            description: "Votre candidature a été enregistrée mais l'email de notification n'a pas pu être envoyé.",
            variant: "default",
          });
        }

        navigate('/stages');
      } catch (uploadErr) {
        console.error('Upload failed, rolling back application...');
        // Rollback: delete the application if upload fails
        await supabase.from('applications').delete().eq('id', application.id);
        throw uploadErr;
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'envoi de votre candidature",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log('Form submission completed');
    }
  };

  if (!stage) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Stage non trouvé</p>
              <Button 
                onClick={() => navigate('/stages')} 
                className="w-full mt-4"
              >
                Retour aux stages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Candidature pour : {stage.title}
            </CardTitle>
            <p className="text-center text-muted-foreground">
              {stage.company} - {stage.location}
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prenoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénoms *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        <FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sexe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexe *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-row space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="masculin" id="masculin" />
                            <Label htmlFor="masculin">Masculin</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="feminin" id="feminin" />
                            <Label htmlFor="feminin">Féminin</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ecole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>École *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="universite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Université</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="filiere"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filière *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annee_etude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Année d'étude *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1ere">1ère année</SelectItem>
                              <SelectItem value="2eme">2ème année</SelectItem>
                              <SelectItem value="3eme">3ème année</SelectItem>
                              <SelectItem value="4eme">4ème année</SelectItem>
                              <SelectItem value="5eme">5ème année</SelectItem>
                              <SelectItem value="master1">Master 1</SelectItem>
                              <SelectItem value="master2">Master 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="temps_stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée du stage *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1mois">1 mois</SelectItem>
                              <SelectItem value="2mois">2 mois</SelectItem>
                              <SelectItem value="3mois">3 mois</SelectItem>
                              <SelectItem value="4mois">4 mois</SelectItem>
                              <SelectItem value="5mois">5 mois</SelectItem>
                              <SelectItem value="6mois">6 mois</SelectItem>
                              <SelectItem value="plus6mois">Plus de 6 mois</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date_debut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de début *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="lettre_demande">Lettre de demande de stage (PDF) *</Label>
                  <Input
                    id="lettre_demande"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                  {lettreDemandeFile && (
                    <p className="text-sm text-green-600 mt-1">
                      Fichier sélectionné: {lettreDemandeFile.name}
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="lettre_motivation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lettre de motivation *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="Expliquez pourquoi vous souhaitez effectuer ce stage..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
            )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/stages')}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer la candidature"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
                    }
