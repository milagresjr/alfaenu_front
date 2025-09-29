"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Plus, Edit, Trash, Download, File } from "lucide-react";
import { useAlterarEstadoContrato } from "@/features/contract/hooks/useContractQuery";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { usePOSStore } from "@/features/pos/store/usePOSStore";
import { PauseCircle, XCircle, CheckCircle, PlayCircle } from "lucide-react";
import { alert } from "@/lib/alert";
import ContractFinalizadoDialog from "./ContratoFinalizadoDialog";
import LoadingDialog from "./LoadingDialog";
import { downloadPdfContratoFinalizado, gerarPdfContratoFinalizado } from "@/lib/utils";

export default function FloatingButton() {

  const [open, setOpen] = useState(false);

  const [openDialogContratoFina, setOpenDialogContratoFina] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  const { clienteContrato, updateEstado } = usePOSStore();

  const altEstado = useAlterarEstadoContrato();

  const queryClient = useQueryClient();

  async function alterarEstado(estado: string) {
    if (!clienteContrato) {
      toast.error("Selecione um contrato!");
      return;
    }

    // mapa de mensagens por estado
    const mensagens: Record<string, { confirm: string; success: string; error: string }> = {
      suspenso: {
        confirm: "Deseja suspender este contrato?",
        success: "Contrato suspenso com sucesso!",
        error: "Erro ao suspender o contrato!",
      },
      cancelado: {
        confirm: "Deseja cancelar este contrato?",
        success: "Contrato cancelado com sucesso!",
        error: "Erro ao cancelar o contrato!",
      },
      finalizado: {
        confirm: "Deseja finalizar este contrato?",
        success: "Contrato finalizado com sucesso!",
        error: "Erro ao finalizar o contrato!",
      },
      ativo: {
        confirm: "Deseja ativar este contrato?",
        success: "Contrato ativado com sucesso!",
        error: "Erro ao ativar o contrato!",
      },
    };

    const confirmMessage = mensagens[estado]?.confirm || "Alterar estado do contrato?";
    const confirmed = await alert.confirm(confirmMessage);

    if (confirmed) {
      altEstado.mutate(
        { id: Number(clienteContrato?.id), estado },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["contratos"],
              exact: false,
            });
            toast.success(mensagens[estado]?.success || "Estado do contrato alterado com sucesso!");
            updateEstado(estado);
            toggleMenu();
            if (estado === "finalizado") {
              setOpenDialogContratoFina(true);
            }
          },
          onError: (error: any) => {
            toast.error(mensagens[estado]?.error || "Erro ao alterar o estado do contrato!");
            console.log(error);
          },
        }
      );
    }
  }


  const actions = [
    {
      icon: <PlayCircle size={20} />,
      label: "Ativar",
      onClick: () => alterarEstado("ativo"),
      hidden: clienteContrato?.estado === "suspenso" ? true : false
    },
    {
      icon: <PauseCircle size={20} />,
      label: "Suspender",
      onClick: () => alterarEstado("suspenso"),
      hidden: clienteContrato?.estado === "ativo" ? true : false
    },
    {
      icon: <XCircle size={20} />,
      label: "Cancelar",
      onClick: () => alterarEstado("cancelado"),
      hidden: clienteContrato?.estado === "ativo" ? true : false
    },
    {
      icon: <CheckCircle size={20} />,
      label: "Finalizar",
      onClick: () => alterarEstado("finalizado"),
      hidden: clienteContrato?.estado === "ativo" ? true : false
    },
    {
      icon: <Download size={20} />,
      label: "Download",
      onClick: () => downloadPdfContratoFinalizado(clienteContrato?.id),
      hidden: clienteContrato?.estado === "finalizado" ? true : false
    },
    {
      icon: <File size={20} />,
      label: "Abrir pdf",
      onClick: () => gerarPdfContratoFinalizado(clienteContrato?.id),
      hidden: clienteContrato?.estado === "finalizado" ? true : false
    },
  ];

  if(altEstado.isPending){
    return (
      <LoadingDialog/>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2">
      <AnimatePresence>
        {open &&
          actions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onClick={action.onClick}
              className={`w-[120px] flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                shadow-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700
                ${!action.hidden ? "hidden" : ""}
                `}
            >
              {action.icon}
              <span className="text-sm">{action.label}</span>
            </motion.button>
          ))}
      </AnimatePresence>

      {/* Botão principal */}
      <button
        onClick={toggleMenu}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus size={24} />
        </motion.div>
      </button>

      <ContractFinalizadoDialog
        open={openDialogContratoFina}
        onClose={() => setOpenDialogContratoFina(false)}
        onDownload={() => downloadPdfContratoFinalizado(clienteContrato?.id)}
        onOpenPdf={() => gerarPdfContratoFinalizado(clienteContrato?.id)}
        // filename={"Contrato.pdf"}
      />

    </div>
  );
}
