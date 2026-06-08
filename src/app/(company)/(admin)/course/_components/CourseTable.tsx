'use client';

import { Users, UserCheck, UserX, Edit, Trash, Lock, Unlock, Info, Search } from "lucide-react";

import { CourseType } from "@/features/course/types";
import { TableMain } from "@/components/table";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { formatarDataLong, formatarMoeda } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/pagination/Pagination";
import { useMemo } from "react";
import { useProgress } from "@bprogress/next";
import LoadingDialog from "../../../../(full-width-pages)/pos/_components/LoadingDialog";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";
import { useAlterarEstadoCourse, useCourses, useDeleteCourse } from "@/features/course/hooks/useCourseQuery";
import { useCourseStore } from "@/features/course/store/useCourseStore";


export default function CourseTable() {

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const debouncedSearch = useDebounce(search, 500);

  const { setSelectedCourse } = useCourseStore();

  const [selected, setSelected] = useState<"ativo" | "inativo" | "todos">(
    "todos"
  );

  const { data: dataCourses, isLoading, isError } = useCourses(page, perPage, debouncedSearch, selected !== 'todos' ? selected : '');

  const router = useRouter();

  const progress = useProgress();

  const deleteCurso = useDeleteCourse();
  const alterarEstado = useAlterarEstadoCourse();

  const handleEdit = (curso: CourseType) => {
    setSelectedCourse(curso);
    progress.start();
    router.push(`/course/form`);
  };

  const handleNewCurso = () => {
    setSelectedCourse(null);
    progress.start();
    router.push(`/course/form`);
  };


  const queryClient = useQueryClient();

  const handleDelete = async (curso: CourseType) => {
    setSelectedCourse(curso);
    const confirmed = await alert.confirm('Confirmar', 'Tem certeza que deseja excluir este curso?', 'Sim', 'Não');
    if (confirmed) {
      setSelectedCourse(null);
      deleteCurso.mutate(curso.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["cursos"],
            exact: false,
          });
          toast.success('Curso excluído com sucesso!');
        },
        onError: (error) => {
          console.error("Erro ao excluir o curso:", error);
        },
      });
    }
  };


  // const stats = [
  //   {
  //     key: "todos",
  //     title: "Total de Cursos",
  //     value: data?.total_geral.toString(),
  //     change: "",
  //     icon: <Users className="w-6 h-6 text-blue-600" />,
  //   },
  //   {
  //     key: "ativo",
  //     title: "Cursos Ativos",
  //     value: data?.total_ativos.toString(),
  //     change: "",
  //     icon: <UserCheck className="w-6 h-6 text-green-600" />,
  //   },
  //   {
  //     key: "inativo",
  //     title: "Cursos Inativos",
  //     value: data?.total_inativos.toString(),
  //     change: "",
  //     icon: <UserX className="w-6 h-6 text-red-600" />,
  //   },
  // ];


  // const cursosFiltrados = useMemo(() => {
  //   if (selected === "ativo") {
  //     return data?.data.filter(curso => curso.estado === "ativo");
  //   } else if (selected === "inativo") {
  //     return data?.data.filter(curso => curso.estado === "inativo");
  //   }
  //   return data?.data;
  // }, [selected, data]);

  useEffect(() => {
    setPage(1);
  }, [selected]);

  if (isError) {
    return <div>Erro ao carregar cursos</div>;
  }

  if (alterarEstado.isPending) {
    return (
      <LoadingDialog />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 p-4 min-h-[calc(100vh-130px)]">

      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Cursos
        </h1>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.value!}
            change={stat.change}
            icon={stat.icon}
            isActive={selected === stat.key}
            onClick={() => setSelected(stat.key as typeof selected)}
          />
        ))}
      </div> */}

      <div className="my-4 flex items-center justify-between gap-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <button onClick={handleNewCurso} className="bg-blue-600 px-4 py-2 rounded-md text-white flex gap-1">
          <Plus />
          Novo
        </button>
      </div>

      <TableMain
        data={dataCourses?.data || []}
        isLoading={isLoading}
        emptyMessage="Nenhum curso encontrado."
        columns={[
          {
            //Header para mostrar a imagem
            header: "Imagem",
            accessor: (curso: CourseType) => curso.imagem ? <img src={curso.imagem} alt={curso.nome} className="w-16 h-16 object-cover rounded" /> : <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">Sem imagem</div>,
            width: "10%",
          },
          {
            header: "Nome",
            accessor: "nome",
          },
          {
            header: "Local",
            accessor: "local",
          },
          // {
          //   header: "Estado",
          //   accessor: (curso: CursoType) => <EstadoCell curso={curso} />,
          //   width: "10%",
          // },
          {
            header: "Preço",
            accessor: (item: any) => (
              <span>{formatarMoeda(item.preco)}</span>
            ),
          },
          {
            header: "Duração",
            accessor: (item: any) => (
              <span>{item.duracao}</span>
            ),
          },
          {
            header: "",
            accessor: (curso) => {
              const actions = [
                {
                  label: "Editar",
                  icon: <Edit />,
                  onClick: () => handleEdit(curso),
                },
                {
                  label: "Excluir",
                  icon: <Trash />,
                  onClick: () => handleDelete(curso),
                },
                // {
                //   label: curso.estado === "ativo" ? "Inativar" : "Ativar",
                //   icon: curso.estado === "ativo" ? <Lock /> : <Unlock />,
                //   onClick: () => toggleEstado(curso),
                // },
              ];
              return <DropdownActions actions={actions} />;
            },
            width: "5%",
          },
        ]}
      />


      {/* Paginação */}
      {dataCourses && (
        <PaginationComponent
          currentPage={dataCourses.current_page}
          itemsPerPage={dataCourses.per_page}
          totalItems={dataCourses.total}
          lastPage={dataCourses.last_page}
          onPageChange={setPage}
          onItemsPerPageChange={value => {
            setPage(1)
            setPerPage(value)
          }}
        />
      )}

    </div>
  );
}
