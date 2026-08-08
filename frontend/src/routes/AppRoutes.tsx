import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import Product from "../pages/Product/Product";
import Designer from "../pages/Designer/Designer";
import DesignerLayout from "../components/layout/DesignerLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<Product />} />
      </Route>

      <Route element={<DesignerLayout />}>
        <Route path="/designer/:productId" element={<Designer />} />
      </Route>

      </Routes>
    </BrowserRouter>
  );
}