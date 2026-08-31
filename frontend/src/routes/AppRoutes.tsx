import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import DesignerLayout from "../components/layout/DesignerLayout";

import Home from "../pages/Home/Home";

import Shop from "../pages/Shop/Shop";

import Product from "../pages/Product/Product";

import Designer from "../pages/Designer/Designer";

import Cart from "../pages/Cart/Cart";

import Login from "../pages/Login/Login";

import Register from "../pages/Register/Register";

import AuthConfirmed from "../pages/AuthConfirmed/AuthConfirmed";

import Customize from "../pages/Customize/Customize";

import ShopProduct from "../pages/ShopProduct/ShopProduct";

import Checkout from "../pages/Checkout/Checkout";

import OrderConfirmation from "../pages/OrderConfirmation/OrderConfirmation";

import CustomizeCategory from "../pages/CustomizeCategory/CustomizeCategory";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================
            MAIN WEBSITE
        ===================================== */}

        <Route
          element={
            <MainLayout />
          }
        >

          <Route
            path="/"
            element={
              <Home />
            }
          />

          <Route
            path="/shop"
            element={
              <Shop />
            }
          />

          <Route
            path="/shop/:productId"
            element={
              <ShopProduct />
            }
          />

          <Route
            path="/customize"
            element={
              <Customize />
            }
          />

          <Route
            path="/customize/:category"
            element={<CustomizeCategory />}
          />

          <Route
            path="/product/:productId"
            element={
              <Product />
            }
          />

          <Route
            path="/cart"
            element={
              <Cart />
            }
          />

          <Route
            path="/checkout"
            element={
              <Checkout />
            }
          />

          <Route
            path="/order-confirmation/:orderId"
            element={
              <OrderConfirmation />
            }
          />

          <Route
            path="/login"
            element={
              <Login />
            }
          />

          <Route
            path="/register"
            element={
              <Register />
            }
          />

          <Route
            path="/auth/confirmed"
            element={
              <AuthConfirmed />
            }
          />

        </Route>

        {/* =====================================
            DESIGNER
        ===================================== */}

        <Route
          element={
            <DesignerLayout />
          }
        >

          <Route
            path="/designer/:productId"
            element={
              <Designer />
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}