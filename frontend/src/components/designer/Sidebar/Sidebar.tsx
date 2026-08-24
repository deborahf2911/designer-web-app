import {
  useState,
  type ChangeEvent,
} from "react";

import type { ProductView } from "../../../types/designer";
import type { ProductColor } from "../../../types/productColor";
import type { TextStyle } from "../../../features/designer/models/textStyle";

interface SidebarProps {

  currentView: ProductView;

  productColor: ProductColor;

  onColorChange: (
    color: ProductColor
  ) => void;

  onViewChange: (
    view: ProductView
  ) => void;

  onImageUpload: (
    file: File
  ) => void;

  onDeleteSelected: () => void;

  onTextAdd: (
    text: string
  ) => void;

  onTextColorChange: (
    color: string
  ) => void;

  onFontChange: (
    font: string
  ) => void;

  onBold: () => void;

  onItalic: () => void;

  onUnderline: () => void;

  onFontSizeChange: (
    amount: number
  ) => void;

  textSelected: boolean;

  // ADD THIS
  textStyle: TextStyle;
}

export default function Sidebar({
  currentView,
  productColor,

  onViewChange,
  onColorChange,

  onImageUpload,
  onDeleteSelected,

  onTextAdd,

  onTextColorChange,
  onFontChange,

  onBold,
  onItalic,
  onUnderline,

  onFontSizeChange,

  textSelected,

  textStyle,
}: SidebarProps) {
  const views: ProductView[] = [
    "front",
    "back",
    "left",
    "right",
  ];

  const colors: ProductColor[] = [
    "white",
    "black",
    "navy",
    "red",
    "green",
  ];

  const [text, setText] =
    useState("");

  //--------------------------------------------------
  // FILE UPLOAD
  //--------------------------------------------------

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) {
      return;
    }

    onImageUpload(
      e.target.files[0]
    );

    e.target.value = "";
  };

  //--------------------------------------------------
  // ADD TEXT
  //--------------------------------------------------

  const handleAddText = () => {
    const trimmedText =
      text.trim();

    if (!trimmedText) {
      return;
    }

    onTextAdd(trimmedText);

    setText("");
  };

  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r bg-white p-5 shadow-sm">

      {/* TITLE */}

      <h1 className="mb-8 text-2xl font-bold">
        T-Shirt Designer
      </h1>

      {/* VIEWS */}

      <div className="mb-6 space-y-2">

        {views.map((view) => (
          <button
            key={view}
            type="button"
            onClick={() =>
              onViewChange(view)
            }
            className={`w-full rounded-lg px-4 py-3 text-left capitalize ${
              currentView === view
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {view}
          </button>
        ))}

      </div>

      {/* COLORS */}

      <div className="mb-6">

        <h2 className="mb-3 text-lg font-semibold">
          Shirt Color
        </h2>

        <div className="grid grid-cols-2 gap-3">

          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() =>
                onColorChange(color)
              }
              className={`flex min-w-0 items-center gap-3 rounded-lg border p-3 transition-all ${
                productColor === color
                  ? "border-blue-600 bg-blue-50 shadow"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >

              <span
                className={`h-6 w-6 shrink-0 rounded-full border ${
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

      {/* UPLOAD */}

      <label className="block w-full cursor-pointer rounded-lg bg-green-600 py-3 text-center font-medium text-white transition hover:bg-green-700">

        Upload Image

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={
            handleFileChange
          }
        />

      </label>

      {/* ADD TEXT */}

      <div className="mt-6">

        <h2 className="mb-3 text-lg font-semibold">
          Add Text
        </h2>

        <input
          type="text"
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddText();
            }
          }}
          placeholder="Enter your text..."
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={handleAddText}
          disabled={!text.trim()}
          className="mt-3 w-full rounded-lg bg-blue-600 py-3 text-center font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Text
        </button>

      </div>

      {/* ========================================= */}
      {/* TEXT STYLE */}
      {/* ========================================= */}

      {textSelected && (
      <div className="mt-6 border-t pt-6">
        <h2 className="mb-4 text-lg font-semibold">
          Text Style
        </h2>

        {/* Font */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Font
          </label>

          <select
            value={textStyle.fontFamily}
            onChange={(e) =>
              onFontChange(e.target.value)
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <optgroup label="Modern">
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
            </optgroup>

            <optgroup label="Bold / T-Shirt">
              <option value="Bebas Neue">Bebas Neue</option>
              <option value="Oswald">Oswald</option>
              <option value="Anton">Anton</option>
            </optgroup>

            <optgroup label="Elegant">
              <option value="Playfair Display">
                Playfair Display
              </option>
            </optgroup>

            <optgroup label="Display">
              <option value="Righteous">Righteous</option>
            </optgroup>

            <optgroup label="Handwritten">
              <option value="Lobster">Lobster</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Permanent Marker">
                Permanent Marker
              </option>
            </optgroup>

            <optgroup label="Streetwear">
              <option value="Bebas Neue">Bebas Neue</option>
              <option value="Bungee">Bungee</option>
              <option value="Anton">Anton</option>
              <option value="Russo One">Russo One</option>
              <option value="Staatliches">Staatliches</option>
              <option value="Teko">Teko</option>
            </optgroup>

            <optgroup label="Fun / Graphic">
              <option value="Bangers">Bangers</option>
              <option value="Luckiest Guy">Luckiest Guy</option>
              <option value="Londrina Solid">Londrina Solid</option>
              <option value="Fugaz One">Fugaz One</option>
            </optgroup>

            <optgroup label="Retro">
              <option value="Monoton">Monoton</option>
              <option value="Silkscreen">Silkscreen</option>
            </optgroup>

            <optgroup label="Futuristic">
              <option value="Orbitron">Orbitron</option>
            </optgroup>

            <optgroup label="Special">
              <option value="Creepster">Creepster</option>
            </optgroup>
          </select>
        </div>

        {/* Color */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Text Color
          </label>

          <input
            type="color"
            value={textStyle.fill}
            onChange={(e) =>
              onTextColorChange(
                e.target.value
              )
            }
            className="h-10 w-full cursor-pointer rounded-lg border"
          />
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Font Size
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                onFontSizeChange(-2)
              }
              className="flex-1 rounded-lg bg-gray-100 py-2 hover:bg-gray-200"
            >
              −
            </button>

            <div className="flex flex-1 items-center justify-center rounded-lg border">
              {textStyle.fontSize}
            </div>

            <button
              type="button"
              onClick={() =>
                onFontSizeChange(2)
              }
              className="flex-1 rounded-lg bg-gray-100 py-2 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Formatting */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBold}
            className={`flex-1 rounded-lg border py-2 font-bold ${
              textStyle.fontWeight === "bold"
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "bg-white"
            }`}
          >
            B
          </button>

          <button
            type="button"
            onClick={onItalic}
            className={`flex-1 rounded-lg border py-2 italic ${
              textStyle.fontStyle === "italic"
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "bg-white"
            }`}
          >
            I
          </button>

          <button
            type="button"
            onClick={onUnderline}
            className={`flex-1 rounded-lg border py-2 underline ${
              textStyle.underline
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "bg-white"
            }`}
          >
            U
          </button>
        </div>
      </div>
    )}

      {/* DELETE */}

      <button
        type="button"
        onClick={onDeleteSelected}
        className="mt-6 w-full rounded-lg bg-red-600 py-3 text-center font-medium text-white transition hover:bg-red-700"
      >
        Delete Selected
      </button>

    </aside>
  );
}