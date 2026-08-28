import {
  CheckCircle2,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

interface ConfirmationState {
  orderNumber?: string;

  total?: number;

  email?: string;
}

export default function OrderConfirmation() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    orderId,
  } =
    useParams();

  const state =
    location.state as
      | ConfirmationState
      | null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">

      <div className="rounded-3xl border bg-white px-8 py-14 text-center shadow-sm">

        <CheckCircle2
          size={72}
          className="mx-auto text-green-600"
        />

        <h1 className="mt-6 text-4xl font-bold">
          Order Placed Successfully
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Thank you for your order. We have received your order details and customization information.
        </p>

        {state?.orderNumber && (
          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-gray-50 p-6">

            <p className="text-sm text-gray-500">
              Order Number
            </p>

            <p className="mt-1 text-xl font-bold">
              {
                state.orderNumber
              }
            </p>

            {typeof state.total ===
              "number" && (
              <>
                <p className="mt-5 text-sm text-gray-500">
                  Order Total
                </p>

                <p className="mt-1 text-xl font-bold">
                  Rs.{" "}
                  {state.total.toLocaleString()}
                </p>
              </>
            )}

          </div>
        )}

        {state?.email && (
          <p className="mt-6 text-sm text-gray-500">
            Order contact email:{" "}
            <span className="font-medium text-gray-700">
              {state.email}
            </span>
          </p>
        )}

        {!state?.orderNumber &&
          orderId && (
            <p className="mt-6 text-sm text-gray-500">
              Order reference:{" "}
              {orderId}
            </p>
          )}

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/"
              )
            }
            className="rounded-xl border px-6 py-3 font-semibold transition hover:bg-gray-50"
          >
            Back to Home
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/shop"
              )
            }
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
}