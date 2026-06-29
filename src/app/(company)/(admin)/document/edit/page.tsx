import type { Metadata } from "next";
import Editor from "@/components/editor/editor";

export const metadata: Metadata = {
  title: "Editor de Documentos",
  description: "Editor de documentos e conteúdos no sistema Alfaenu",
};

export default function Page() {
    return(
        <Editor/>
    )
}