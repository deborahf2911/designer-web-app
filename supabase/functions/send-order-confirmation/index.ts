import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY =
  Deno.env.get("RESEND_API_KEY");

const EMAIL_FROM =
  Deno.env.get("ORDER_EMAIL_FROM") ??
  "Kingdom Threads <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "RESEND_API_KEY is not configured.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const {
      customerName,
      customerEmail,
      orderNumber,
    } = await request.json();

    if (
      !customerName ||
      !customerEmail ||
      !orderNumber
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required email information.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const safeName =
      escapeHtml(String(customerName));

    const safeOrderNumber =
      escapeHtml(String(orderNumber));

    const resendResponse =
      await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${RESEND_API_KEY}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            from: EMAIL_FROM,

            to: [
              customerEmail,
            ],

            subject:
              `Order Confirmation - ${orderNumber}`,

            html: `
              <!doctype html>
              <html>
                <body
                  style="
                    margin: 0;
                    padding: 0;
                    background: #f5f5f5;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #111111;
                  "
                >
                  <div
                    style="
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 32px 16px;
                    "
                  >
                    <div
                      style="
                        background: #ffffff;
                        border: 1px solid #e5e5e5;
                        border-radius: 12px;
                        overflow: hidden;
                      "
                    >
                      <div
                        style="
                          background: #111111;
                          color: #ffffff;
                          padding: 26px 30px;
                        "
                      >
                        <h1
                          style="
                            margin: 0;
                            font-size: 24px;
                          "
                        >
                          Kingdom Threads
                        </h1>

                        <p
                          style="
                            margin: 6px 0 0;
                            color: #d4d4d4;
                          "
                        >
                          Order Confirmation
                        </p>
                      </div>

                      <div
                        style="
                          padding: 30px;
                        "
                      >
                        <h2
                          style="
                            margin: 0 0 16px;
                          "
                        >
                          Thank you for your order!
                        </h2>

                        <p>
                          Hi ${safeName},
                        </p>

                        <p
                          style="
                            line-height: 1.6;
                          "
                        >
                          We've successfully received
                          your Kingdom Threads order.
                        </p>

                        <div
                          style="
                            margin: 24px 0;
                            padding: 18px;
                            background: #f5f5f5;
                            border-radius: 8px;
                          "
                        >
                          <div
                            style="
                              color: #737373;
                              font-size: 13px;
                            "
                          >
                            ORDER NUMBER
                          </div>

                          <div
                            style="
                              margin-top: 5px;
                              font-size: 19px;
                              font-weight: 700;
                            "
                          >
                            ${safeOrderNumber}
                          </div>
                        </div>

                        <p
                          style="
                            line-height: 1.6;
                          "
                        >
                          We'll contact you if we need
                          any additional information
                          regarding your order.
                        </p>

                        <p
                          style="
                            margin-top: 28px;
                          "
                        >
                          Thank you for shopping with
                          Kingdom Threads.
                        </p>
                      </div>
                    </div>
                  </div>
                </body>
              </html>
            `,
          }),
        }
      );

    const resendData =
      await resendResponse.json();

    if (!resendResponse.ok) {
      console.error(
        "Resend error:",
        resendData
      );

      return new Response(
        JSON.stringify({
          error:
            "Unable to send confirmation email.",
          details:
            resendData,
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailId: resendData.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Email function error:",
      error
    );

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});