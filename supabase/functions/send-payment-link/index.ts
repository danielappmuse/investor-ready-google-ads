import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentLinkRequest {
  email: string;
  name: string;
  paymentLink: string;
  amount?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, paymentLink, amount }: PaymentLinkRequest = await req.json();

    console.log("Sending payment link email to:", email);

    // Validate required fields
    if (!email || !name || !paymentLink) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, name, or paymentLink" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const sendinblueApiKey = Deno.env.get("SENDINBLUE_API_KEY");
    
    if (!sendinblueApiKey) {
      console.error("SENDINBLUE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email via Sendinblue API
    const emailResponse = await fetch("https://api.sendinblue.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": sendinblueApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "StartWise",
          email: "noreply@startwise.com" // Replace with your verified sender email
        },
        to: [
          {
            email: email,
            name: name
          }
        ],
        subject: "Your StartWise Payment Link",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Payment Link</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">StartWise</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${name}!</h2>
              
              <p style="font-size: 16px; color: #4b5563;">
                Thank you for choosing StartWise for your startup journey. We're excited to help you become investor-ready!
              </p>
              
              ${amount ? `<p style="font-size: 16px; color: #4b5563;"><strong>Amount:</strong> ${amount}</p>` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${paymentLink}" 
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Complete Your Payment
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If the button doesn't work, you can copy and paste this link into your browser:
              </p>
              <p style="font-size: 14px; color: #3b82f6; word-break: break-all;">
                ${paymentLink}
              </p>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 14px; color: #6b7280; margin: 5px 0;">
                  Questions? Contact us at <a href="tel:+17868291382" style="color: #3b82f6; text-decoration: none;">+1 (786) 829-1382</a>
                </p>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
                  This link is secure and personalized for you. Please do not share it with others.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
              <p>© 2025 StartWise. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const responseData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Sendinblue API error:", responseData);
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email",
          details: responseData 
        }),
        {
          status: emailResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email sent successfully via Sendinblue:", responseData);

    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: responseData.messageId,
        message: "Payment link sent successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-payment-link function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "An unexpected error occurred while sending the payment link"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
