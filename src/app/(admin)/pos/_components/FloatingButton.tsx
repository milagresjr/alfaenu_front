"use client";

import { Plus, Save } from "lucide-react";

export default function FloatingButton() {
  return (
    <button
      className="
        fixed 
        bottom-6 right-6 
        bg-blue-600 
        text-white 
        p-4 
        rounded-full 
        shadow-lg 
        hover:bg-blue-700 
        transition
      "
     // onClick={() => alert("Botão flutuante clicado!")}
    >
      <Save size={24} />
    </button>
  );
}
