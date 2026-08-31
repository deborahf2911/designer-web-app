import { supabase } from "../lib/supabase";

interface SendOrderConfirmationInput {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
}

export async function sendOrderConfirmationEmail(
  input: SendOrderConfirmationInput
) {
  const { data, error } =
    await supabase.functions.invoke(
      "send-order-confirmation",
      {
        body: input,
      }
    );

  if (error) {
    throw error;
  }

  return data;
}