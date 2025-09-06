import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

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

// Email validation helper
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Retry helper for email sending
const sendWithRetry = async (emailParams: any, maxRetries = 2): Promise<any> => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email attempt ${attempt}/${maxRetries}`);
      return await resend.emails.send(emailParams);
    } catch (error) {
      lastError = error;
      console.error(`Email attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
    }
  }
  
  throw lastError;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { application, stage }: RequestBody = await req.json();

    console.log("Sending application emails for:", application.id);

    // Validate email addresses
    if (!isValidEmail(application.email)) {
      return new Response(JSON.stringify({ 
        error: "Invalid candidate email address",
        details: "validation_error"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!isValidEmail(stage.contactEmail)) {
      return new Response(JSON.stringify({ 
        error: "Invalid company email address",
        details: "validation_error"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send all emails concurrently
    const emailPromises = [
      // 1. Email à l'entreprise
      sendWithRetry({
        from: "Après Mon Bac <onboarding@resend.dev>",
        to: [stage.contactEmail],
        reply_to: [application.email],
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
      }).catch(error => ({ error, type: 'company' })),

      // 2. Email de confirmation au candidat
      sendWithRetry({
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
      }).catch(error => ({ error, type: 'candidate' })),

      // 3. Email de notification à l'admin
      sendWithRetry({
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
      }).catch(error => ({ error, type: 'admin' }))
    ];

    console.log("Sending emails concurrently...");
    const results = await Promise.allSettled(emailPromises);

    // Process results
    const emailResults = {
      company: results[0].status === 'fulfilled' ? results[0].value : results[0].reason,
      candidate: results[1].status === 'fulfilled' ? results[1].value : results[1].reason,
      admin: results[2].status === 'fulfilled' ? results[2].value : results[2].reason
    };

    // Count successful emails
    let successCount = 0;
    const errors: string[] = [];

    Object.entries(emailResults).forEach(([type, result]) => {
      if (result.error) {
        errors.push(`${type}: ${result.error.message || result.error}`);
        console.error(`${type} email failed:`, result.error);
      } else {
        successCount++;
        console.log(`${type} email sent successfully:`, result.id);
      }
    });

    return new Response(JSON.stringify({
      success: successCount > 0,
      total_emails: 3,
      successful_emails: successCount,
      failed_emails: 3 - successCount,
      results: emailResults,
      errors: errors.length > 0 ? errors : null
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-application-email function:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    // Log specific email sending errors
    if (error.name === 'validation_error' || error.message?.includes('validation_error')) {
      console.error("RESEND VALIDATION ERROR - Vérifiez la clé API et le domaine validé");
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.name || "Unknown error type"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);