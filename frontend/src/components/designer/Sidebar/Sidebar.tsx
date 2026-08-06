import type { ChangeEvent } from "react";
import type { ProductView } from "../../../types/designer";
import type { ProductColor } from "../../../types/productColor";

interface SidebarProps {
  currentView: ProductView;
  productColor: ProductColor;
  onViewChange: (view: ProductView) => void;
  onColorChange: (color: ProductColor) => void;
  onImageUpload: (file: File) => void;
}

export default function Sidebar({
  currentView,
  productColor,
  onViewChange,
  onColorChange,
  onImageUpload,
}: SidebarProps) {
  const views: ProductView[] = ["front", "back", "left", "right"];

  const colors: ProductColor[] = [
    "white",
    "black",
    "navy",
    "red",
    "green"
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    onImageUpload(e.target.files[0]);
  };

  return (
    <aside className="w-64 border-r bg-white p-5 shadow-sm">
      <h1 className="mb-8 text-2xl font-bold">
        T-Shirt Designer
      </h1>

      <div className="space-y-2 mb-6">
        {views.map((view) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`w-full rounded-lg px-4 py-3 text-left capitalize ${
              currentView === view
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">
          Shirt Color
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-all
                ${
                  productColor === color
                    ? "border-blue-600 bg-blue-50 shadow"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <span
                className={`h-6 w-6 rounded-full border
                  ${
                    color === "white"
                      ? "bg-white"
                      : color === "black"
                      ? "bg-black"
                      : color === "navy"
                      ? "bg-blue-900"
                      : color === "red"
                      ? "bg-red-600"
                      : "bg-green-600"
                  }`}
              />

              <span className="capitalize text-sm font-medium">
                {color}
              </span>
            </button>
          ))}
        </div>
      </div>

      <label className="block w-full cursor-pointer rounded-lg bg-green-600 py-3 text-center text-white hover:bg-green-700">
        Upload Image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </aside>
  );
}