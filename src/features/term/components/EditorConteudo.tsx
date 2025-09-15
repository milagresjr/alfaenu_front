"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useTermoStore } from "../store/useTermoStore";

// import dinâmico
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditorConteudo() {

    const { conteudoTermo, setConteudoTermo } = useTermoStore();

    const modules = {
        toolbar: [
            [{ font: [] }], // fontes
            [{ size: [] }], // tamanhos de texto
            ["bold", "italic", "underline", "strike"], // estilos básicos
            [{ color: [] }, { background: [] }], // cores
            [{ script: "sub" }, { script: "super" }], // sobrescrito/subscrito
            [{ header: 1 }, { header: 2 }], // cabeçalhos
            [{ list: "ordered" }, { list: "bullet" }], // listas
            [{ indent: "-1" }, { indent: "+1" }], // identação
            [{ align: [] }], // alinhamento
            ["blockquote", "code-block"], // citação e código
            ["link", "image", "video"], // mídia
            ["clean"], // limpar formatação
        ],
    };

    const formats = [
        "font", "size",
        "bold", "italic", "underline", "strike",
        "color", "background",
        "script",
        "header",
        "list",
        "align",
        "blockquote", "code-block",
        "link", "image", "video",
    ];

    return (
        <div className="p-4">
            <ReactQuill
                theme="snow"
                value={conteudoTermo}
                onChange={(content) => setConteudoTermo(content)} // 👈 importante
                placeholder="Escreva algo..."
                className="bg-white rounded-lg quill-dark"
                modules={modules}
                formats={formats}
            />

        </div>
    );
}
