"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill-new/dist/quill.snow.css";

// import dinâmico
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function Editor() {

  const [value, setValue] = useState("");

  function handleClick() {
    console.log(value);
  }


  return (
    <div className="p-4">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(content) => setValue(content)} // 👈 importante
        placeholder="Escreva algo..."
        className="bg-white rounded-lg quill-dark"
      />

      <div className="mt-4 p-2 bg-gray-100 rounded">
        <strong>Preview:</strong>
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>

      <button onClick={handleClick} className="bg-blue-600 text-white p-4 rounded mt-4">Salvar</button>
    </div>
  );
}
