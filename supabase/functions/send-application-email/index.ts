import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Get and validate API key
const resendApiKey = Deno.env.get("RESEND_API_KEY");
console.log("RESEND_API_KEY present:", !!resendApiKey);

if (!resendApiKey) {
  console.error("CRITICAL ERROR: RESEND_API_KEY environment variable is not set");
  throw new Error("RESEND_API_KEY is required but not configured");
}

const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApplicationData {
  id: string;
  stage_id: string;
  nom: string;
  prenoms: string;
  sexe: string;
  email: string;
  telephone: string;
  ecole: string;
  universite?: string;
  filiere: string;
  annee_etude: string;
  temps_stage: string;
  date_debut: string;
  lettre_demande_url?: string;
  lettre_motivation: string;
  created_at: string;
}

interface StageData {
  id: string;
  title: string;
  company: string;
  location: string;
  contactEmail: string;
  description: string;
}

interface RequestBody {
  application: ApplicationData;
  stage: StageData;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { application, stage }: RequestBody = await req.json();

    console.log("Sending application emails for:", application.id);

    // 1. Email à l'entreprise
    const companyEmailResponse = await resend.emails.send({
      from: "Après Mon Bac <onboarding@resend.dev>",
      to: [stage.contactEmail],
      subject: `Nouvelle candidature de stage - ${application.prenoms} ${application.nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e97316; border-bottom: 2px solid #e97316; padding-bottom: 10px;">
            Nouvelle candidature de stage
          </h1>
          
          <h2 style="color: #333;">Informations sur le stage</h2>
          <p><strong>Poste:</strong> ${stage.title}</p>
          <p><strong>Entreprise:</strong> ${stage.company}</p>
          <p><strong>Lieu:</strong> ${stage.location}</p>
          
          <h2 style="color: #333;">Informations du candidat</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nom:</strong> ${application.nom}</p>
            <p><strong>Prénoms:</strong> ${application.prenoms}</p>
            <p><strong>Sexe:</strong> ${application.sexe}</p>
            <p><strong>Email:</strong> <a href="mailto:${application.email}">${application.email}</a></p>
            <p><strong>Téléphone:</strong> ${application.telephone}</p>
          </div>
          
          <h2 style="color: #333;">Formation</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>École:</strong> ${application.ecole}</p>
            ${application.universite ? `<p><strong>Université:</strong> ${application.universite}</p>` : ''}
            <p><strong>Filière:</strong> ${application.filiere}</p>
            <p><strong>Année d'étude:</strong> ${application.annee_etude}</p>
          </div>
          
          <h2 style="color: #333;">Détails du stage demandé</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Durée souhaitée:</strong> ${application.temps_stage}</p>
            <p><strong>Date de début:</strong> ${new Date(application.date_debut).toLocaleDateString('fr-FR')}</p>
          </div>
          
          <h2 style="color: #333;">Lettre de motivation</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap;">
            ${application.lettre_motivation}
          </div>
          
          ${application.lettre_demande_url ? 
            `<p style="color: #666; font-style: italic;">
              Note: Le candidat a également joint sa lettre de demande de stage officielle en format PDF.
              Pour des raisons de sécurité, ce document n'est pas inclus directement dans cet email.
            </p>` : ''
          }
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              Cette candidature a été envoyée via la plateforme Après Mon Bac le ${new Date(application.created_at).toLocaleDateString('fr-FR')} à ${new Date(application.created_at).toLocaleTimeString('fr-FR')}.
            </p>
            <p style="color: #666; font-size: 14px;">
              Pour répondre au candidat, utilisez directement son adresse email: ${application.email}
            </p>
          </div>
        </div>
      `,
    });

    console.log("Company email sent:", companyEmailResponse);

    // 2. Email de confirmation au candidat
    const candidateEmailResponse = await resend.emails.send({
      from: "Après Mon Bac <onboarding@resend.dev>",
      to: [application.email],
      subject: "Confirmation de votre candidature de stage",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e97316; border-bottom: 2px solid #e97316; padding-bottom: 10px;">
            Candidature envoyée avec succès !
          </h1>
          
          <p>Bonjour ${application.prenoms} ${application.nom},</p>
          
          <p>Nous avons bien reçu votre candidature pour le stage suivant :</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Poste:</strong> ${stage.title}</p>
            <p><strong>Entreprise:</strong> ${stage.company}</p>
            <p><strong>Lieu:</strong> ${stage.location}</p>
            <p><strong>Durée souhaitée:</strong> ${application.temps_stage}</p>
            <p><strong>Date de début:</strong> ${new Date(application.date_debut).toLocaleDateString('fr-FR')}</p>
          </div>
          
          <p>Votre candidature a été transmise à l'entreprise. Ils vous contacteront directement si votre profil correspond à leurs attentes.</p>
          
          <p style="margin-top: 30px;">
            Bonne chance pour votre recherche de stage !<br>
            L'équipe Après Mon Bac
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              Candidature envoyée le ${new Date(application.created_at).toLocaleDateString('fr-FR')} à ${new Date(application.created_at).toLocaleTimeString('fr-FR')}.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Candidate confirmation email sent:", candidateEmailResponse);

    // 3. Email de notification à l'admin
    const adminEmailResponse = await resend.emails.send({
      from: "Après Mon Bac <onboarding@resend.dev>",
      to: ["randolphekm27@gmail.com"],
      subject: `Nouvelle candidature reçue - ${application.prenoms} ${application.nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e97316; border-bottom: 2px solid #e97316; padding-bottom: 10px;">
            Nouvelle candidature sur Après Mon Bac
          </h1>
          
          <p>Une nouvelle candidature de stage vient d'être soumise sur la plateforme.</p>
          
          <h2 style="color: #333;">Détails du candidat</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nom:</strong> ${application.prenoms} ${application.nom}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>École:</strong> ${application.ecole}</p>
            <p><strong>Filière:</strong> ${application.filiere}</p>
            <p><strong>Année:</strong> ${application.annee_etude}</p>
          </div>
          
          <h2 style="color: #333;">Stage visé</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Poste:</strong> ${stage.title}</p>
            <p><strong>Entreprise:</strong> ${stage.company}</p>
            <p><strong>Lieu:</strong> ${stage.location}</p>
            <p><strong>Email entreprise:</strong> ${stage.contactEmail}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              Candidature reçue le ${new Date(application.created_at).toLocaleDateString('fr-FR')} à ${new Date(application.created_at).toLocaleTimeString('fr-FR')}.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    return new Response(JSON.stringify({
      success: true,
      company_email: companyEmailResponse,
      candidate_email: candidateEmailResponse,
      admin_email: adminEmailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-application-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);