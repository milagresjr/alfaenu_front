'use client';
import { Suspense } from "react";
import ProcessoWizard from "./_components/ProcessoWizard";


export default function Page() {


  return (
    <div className="">
      <Suspense fallback={<div>Carregando...</div>}>
        <ProcessoWizard />
      </Suspense>
    </div>
  )
}