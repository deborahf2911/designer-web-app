import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import Product from "../pages/Product/Product";
import Designer from "../pages/Designer/Designer";
import DesignerLayout from "../components/layout/DesignerLayout";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AuthConfirmed from "../pages/AuthConfirmed/AuthConfirmed";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/confirmed" element={<AuthConfirmed />}/>
      </Route>

      <Route element={<DesignerLayout />}>
        <Route path="/designer/:productId" element={<Designer />} />
      </Route>

      </Routes>
    </BrowserRouter>
  );
}