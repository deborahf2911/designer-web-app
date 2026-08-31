import AppRoutes from "./routes/AppRoutes";

import {
  AuthProvider,
} from "./contexts/AuthContext";

import {
  CartProvider,
} from "./contexts/CartContext";

import {
  RegionProvider,
} from "./contexts/RegionContext";

export default function App() {
  return (
    <AuthProvider>
      <RegionProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </RegionProvider>
    </AuthProvider>
  );
}