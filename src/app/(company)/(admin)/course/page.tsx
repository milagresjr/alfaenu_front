import type { Metadata } from "next";
import CourseTable from "./_components/CourseTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Gestão de cursos disponíveis no sistema Alfaenu",
};

export default function Page() {
  return (
    <div>
      <CourseTable />
    </div>
  );
}