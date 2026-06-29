'use client';

import { useState, useMemo } from "react";
import { Search, ClipboardCheck, CheckCircle, XCircle, Clock, AlertCircle, FileText, Upload, MoreVertical } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "react-toastify";
import { TableMain } from "@/components/table";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/StatCard/stat-card";
import { DropdownActions } from "@/components/dropdown-action-menu/drop-actions-menu";
import { formatarDataLong } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { useGetAllSolicitacoes, useAprovarSolicitacao, useRejeitarSolicitacao, useEnviarDeclaracao } from "@/features/solicitacao-matricula/hooks/useAdminSoliMatriculaQuery";
import { SolicitacaoMatriculaType, SolicitacaoStatus } from "@/features/solicitacao-matricula/types";
import { AprovarDialog } from "./AprovarDialog";
import { RejeitarDialog } from "./RejeitarDialog";
import { EnviarDeclaracaoForm } from "./EnviarDeclaracaoForm";

type FilterType = 'todos' | SolicitacaoStatus;

const statusConfig: Record<SolicitacaoStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: {
    label: 'Pendente',
    color: 'text-yellow-600 bg-yellow-100 border-yellow-500',
    icon: <Clock className="h-3 w-3" />,
  },
  aprovado: {
    label: 'Aprovado',
    color: 'text-green-600 bg-green-100 border-green-500',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  rejeitado: {
    label: 'Rejeitado',
    color: 'text-red-600 bg-red-100 border-red-500',
    icon: <XCircle className="h-3 w-3" />,
  },
};

export default function SoliMatriculaTable() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('todos');

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, refetch } = useGetAllSolicitacoes({
    search: debouncedSearch || undefined,
    status: filter !== 'todos' ? filter : undefined,
  });

  const aprovarMutation = useAprovarSolicitacao();
  const rejeitarMutation = useRejeitarSolicitacao();
  const enviarDeclaracaoMutation = useEnviarDeclaracao();

  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoMatriculaType | null>(null);
  const [openAprovar, setOpenAprovar] = useState(false);
  const [openRejeitar, setOpenRejeitar] = useState(false);
  const [openEnviarDeclaracao, setOpenEnviarDeclaracao] = useState(false);

  const stats = useMemo(() => [
    {
      key: 'todos' as const,
      title: 'Total de Solicitações',
      value: data?.total?.toString() || '0',
      change: '',
      icon: <ClipboardCheck className="w-6 h-6 text-blue-600" />,
    },
    {
      key: 'pendente' as const,
      title: 'Pendentes',
      value: data?.total_pendentes?.toString() || '0',
      change: '',
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
    },
    {
      key: 'aprovado' as const,
      title: 'Aprovados',
      value: data?.total_aprovados?.toString() || '0',
      change: '',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      key: 'rejeitado' as const,
      title: 'Rejeitados',
      value: data?.total_rejeitados?.toString() || '0',
      change: '',
      icon: <XCircle className="w-6 h-6 text-red-600" />,
    },
  ], [data]);

  const handleAprovar = () => {
    if (!selectedSolicitacao) return;
    aprovarMutation.mutate(selectedSolicitacao.id, {
      onSuccess: () => {
        toast.success('Solicitação aprovada com sucesso!');
        setOpenAprovar(false);
        setOpenEnviarDeclaracao(true);
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Erro ao aprovar solicitação');
      },
    });
  };

  const handleRejeitar = (motivo: string) => {
    if (!selectedSolicitacao) return;
    rejeitarMutation.mutate(
      { id: selectedSolicitacao.id, motivo },
      {
        onSuccess: () => {
          toast.success('Solicitação rejeitada com sucesso!');
          setOpenRejeitar(false);
          setSelectedSolicitacao(null);
          refetch();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao rejeitar solicitação');
        },
      }
    );
  };

  const handleEnviarDeclaracao = (formData: FormData) => {
    if (!selectedSolicitacao) return;
    enviarDeclaracaoMutation.mutate(
      { id: selectedSolicitacao.id, formData },
      {
        onSuccess: () => {
          toast.success('Declaração enviada com sucesso!');
          setOpenEnviarDeclaracao(false);
          setSelectedSolicitacao(null);
          refetch();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Erro ao enviar declaração');
        },
      }
    );
  };

  const solicitacoes = data?.data || [];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 min-h-[calc(100vh-130px)]">
      <div className="flex justify-start items-center my-4">
        <h1 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
          Solicitações de Matrícula
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            isActive={filter === stat.key}
            onClick={() => setFilter(stat.key)}
          />
        ))}
      </div>

      <div className="my-4 flex items-center justify-between gap-2">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por cliente ou curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <TableMain
        data={solicitacoes}
        isLoading={isLoading}
        emptyMessage="Nenhuma solicitação encontrada."
        columns={[
          {
            header: "Cliente",
            accessor: "cliente_nome",
            width: "25%",
          },
          {
            header: "Curso",
            accessor: "curso_nome",
            width: "25%",
          },
          {
            header: "Status",
            accessor: (solicitacao: SolicitacaoMatriculaType) => {
              const cfg = statusConfig[solicitacao.status];
              return (
                <Badge variant="outline" className={`gap-1 ${cfg.color}`}>
                  {cfg.icon}
                  {cfg.label}
                </Badge>
              );
            },
            width: "15%",
          },
          {
            header: "Data",
            accessor: (solicitacao: SolicitacaoMatriculaType) => (
              <span>{solicitacao.created_at ? formatarDataLong(solicitacao.created_at) : '-'}</span>
            ),
            width: "20%",
          },
          {
            header: "Ações",
            accessor: (solicitacao: SolicitacaoMatriculaType) => {
              const actions = [];

              if (solicitacao.status === 'pendente') {
                actions.push({
                  label: 'Aprovar',
                  icon: <CheckCircle className="h-4 w-4 text-green-600" />,
                  onClick: () => {
                    setSelectedSolicitacao(solicitacao);
                    setOpenAprovar(true);
                  },
                });
                actions.push({
                  label: 'Rejeitar',
                  icon: <XCircle className="h-4 w-4 text-red-600" />,
                  onClick: () => {
                    setSelectedSolicitacao(solicitacao);
                    setOpenRejeitar(true);
                  },
                });
              }

              if (solicitacao.status === 'aprovado') {
                actions.push({
                  label: 'Enviar Declaração',
                  icon: <Upload className="h-4 w-4" />,
                  onClick: () => {
                    setSelectedSolicitacao(solicitacao);
                    setOpenEnviarDeclaracao(true);
                  },
                });
              }

              return <DropdownActions actions={actions} />;
            },
            width: "15%",
          },
        ]}
      />

      {selectedSolicitacao && (
        <>
          <AprovarDialog
            open={openAprovar}
            onOpenChange={setOpenAprovar}
            onConfirm={handleAprovar}
            isLoading={aprovarMutation.isPending}
            clienteNome={selectedSolicitacao.cliente_nome}
            cursoNome={selectedSolicitacao.curso_nome}
          />
          <RejeitarDialog
            open={openRejeitar}
            onOpenChange={setOpenRejeitar}
            onConfirm={handleRejeitar}
            isLoading={rejeitarMutation.isPending}
            clienteNome={selectedSolicitacao.cliente_nome}
            cursoNome={selectedSolicitacao.curso_nome}
          />
          <EnviarDeclaracaoForm
            open={openEnviarDeclaracao}
            onOpenChange={setOpenEnviarDeclaracao}
            onConfirm={handleEnviarDeclaracao}
            isLoading={enviarDeclaracaoMutation.isPending}
            clienteNome={selectedSolicitacao.cliente_nome}
            cursoNome={selectedSolicitacao.curso_nome}
          />
        </>
      )}
    </div>
  );
}
