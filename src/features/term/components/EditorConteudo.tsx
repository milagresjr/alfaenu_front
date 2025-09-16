"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useTermoStore } from "../store/useTermoStore";
import { useState } from "react";
import { Maximize, Minimize } from "lucide-react";

// import dinâmico
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditorConteudo() {
    const { conteudoTermo, setConteudoTermo } = useTermoStore();
    const [fullscreen, setFullscreen] = useState(false);

    const modules = {
        toolbar: [
            [{ font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const formats = [
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "script",
        "header",
        "list",
        "align",
        "blockquote",
        "code-block",
        "link",
        "image",
        "video",
    ];

    return (
        <div
            className={`${fullscreen
                    ? "fixed inset-0 z-[9999] bg-white dark:bg-gray-900 p-4"
                    : "p-4"
                } transition-all`}
        >
            {/* Botão de expandir/fechar tela cheia */}
            <div className="flex justify-end mb-2">
                <button
                    type="button"
                    onClick={() => setFullscreen(!fullscreen)}
                    className="px-3 py-1 rounded bg-gray-700 text-white text-sm hover:bg-gray-800"
                >
                    {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
            </div>

            <ReactQuill
                theme="snow"
                value={conteudoTermo}
                onChange={(content) => setConteudoTermo(content)}
                placeholder="Escreva algo..."
                className="rounded-lg quill-dark placeholder:dark:text-gray-200"
                modules={modules}
                formats={formats}
                style={{
                    height: fullscreen ? "90vh" : "", // altura muda conforme fullscreen
                }}
            />
        </div>
    );
}
