import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VideosExample from "@/components/ui-old/video/VideosExample";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vídeos",
  description: "Componentes de vídeo e multimédia do sistema Alfaenu",
};

export default function VideoPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Videos" />

      <VideosExample />
    </div>
  );
}
