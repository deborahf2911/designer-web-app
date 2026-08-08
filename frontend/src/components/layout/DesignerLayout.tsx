import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function DesignerLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  );
}