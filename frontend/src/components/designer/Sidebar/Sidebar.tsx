import type { ChangeEvent } from "react";
import type { ShirtView } from "../../../types/designer";

interface SidebarProps {
  currentView: ShirtView;
  onViewChange: (view: ShirtView) => void;
  onImageUpload: (file: File) => void;
}

export default function Sidebar({
  currentView,
  onViewChange,
  onImageUpload,
}: SidebarProps) {
  const views: ShirtView[] = ["front", "back", "left", "right"];

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