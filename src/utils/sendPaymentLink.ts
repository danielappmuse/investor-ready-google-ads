import { supabase } from '@/integrations/supabase/client';

interface SendPaymentLinkParams {
  email: string;
  name: string;
  paymentLink: string;
  amount?: string;
}

interface SendPaymentLinkResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
}

/**
 * Sends a payment link to the user's email via Sendinblue
 * @param params - Payment link details including email, name, link, and optional amount
 * @returns Promise with success status and message ID or error
 */
export const sendPaymentLink = async (
  params: SendPaymentLinkParams
): Promise<SendPaymentLinkResponse> => {
  try {
    console.log('Sending payment link to:', params.email);

    const { data, error } = await supabase.functions.invoke('send-payment-link', {
      body: {
        email: params.email,
        name: params.name,
        paymentLink: params.paymentLink,
        amount: params.amount,
      },
    });

    if (error) {
      console.error('Error calling send-payment-link function:', error);
      throw new Error(error.message || 'Failed to send payment link');
    }

    if (data?.error) {
      console.error('Sendinblue API error:', data.error);
      throw new Error(data.error);
    }

    console.log('Payment link sent successfully:', data);
    
    return {
      success: true,
      messageId: data?.messageId,
      message: data?.message || 'Payment link sent successfully',
    };
  } catch (error: any) {
    console.error('Error in sendPaymentLink:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
};
