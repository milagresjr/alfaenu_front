import type { Metadata } from "next";
import { Suspense } from "react";
import { FormCourse } from "@/features/course/components/FormCourse";

export const metadata: Metadata = {
  title: "Novo Curso",
  description: "Registo de novo curso no sistema Alfaenu",
};

export default function Page() {
    return (
        <div>
            <Suspense fallback={<div className="p-8 text-center text-muted-foreground">A carregar...</div>}>
                <FormCourse />
            </Suspense>
        </div>
    )
}