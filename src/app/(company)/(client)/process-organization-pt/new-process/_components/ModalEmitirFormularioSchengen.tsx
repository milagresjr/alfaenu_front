"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Download, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";
import { MyClienteType } from "@/features/myClient/types";
import { ProcessoData } from "@/types/processo";

interface ModalEmitirFormularioSchengenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<FormularioSchengenFormValues>;
  onSuccess?: (pdfUrl: string) => void;
  cliente?: MyClienteType | null;
  data?: ProcessoData;
}

interface FormularioSchengenFormValues {
  residencia_outro_pais: boolean;
  autorizacao_residencia: string;
  num_autorizacao_residencia: string;
  validade_autorizacao_residencia: Date | undefined;
  atividade_profissional: string;
  empregador_nome: string;
  empregador_endereco: string;
  empregador_telefone: string;
  parentesco_ue: string;
  parentesco_outro: string;
  outro_objectivo_viagem: string;
  data_prevista_chegada?: Date | undefined;
  data_prevista_saida?: Date | undefined;
  despesas_proprio: boolean;
  despesas_garante: boolean;
  despesas_dinheiro: boolean;
  despesas_cheques: boolean;
  despesas_cartoes: boolean;
  despesas_alojamento: boolean;
  despesas_transporte: boolean;
  despesas_alojamento_fornecido: boolean;
  despesas_todas_cobertas: boolean;
  despesas_outro_especificar: string;
  despesas_dinheiro_garante: boolean;
  despesas_transporte_garante: boolean;
  despesas_garante_outro_especificar: string;
}

const initialFormValues: FormularioSchengenFormValues = {
  residencia_outro_pais: false,
  autorizacao_residencia: "",
  num_autorizacao_residencia: "",
  validade_autorizacao_residencia: undefined,
  atividade_profissional: "",
  empregador_nome: "",
  empregador_endereco: "",
  empregador_telefone: "",
  parentesco_ue: "",
  parentesco_outro: "",
  outro_objectivo_viagem: "",
  despesas_proprio: false,
  despesas_garante: true,
  despesas_dinheiro: false,
  despesas_cheques: false,
  despesas_cartoes: false,
  despesas_alojamento: false,
  despesas_transporte: false,
  despesas_alojamento_fornecido: false,
  despesas_todas_cobertas: false,
  despesas_outro_especificar: "",
  despesas_dinheiro_garante: false,
  despesas_transporte_garante: false,
  despesas_garante_outro_especificar: "",
  data_prevista_chegada: undefined,
  data_prevista_saida: undefined,
};

function formatDateForPayload(value: Date | undefined): string {
  return value ? format(value, "yyyy-MM-dd") : "";
}

function getInitialValues(
  values?: Partial<FormularioSchengenFormValues>,
  cliente?: MyClienteType | null,
  data?: ProcessoData
): FormularioSchengenFormValues {
  return {
    ...initialFormValues,
    data_prevista_chegada: data?.dataPrevisaoChegada ? new Date(data.dataPrevisaoChegada) : undefined,
    data_prevista_saida: data?.dataPrevisaoSaida ? new Date(data.dataPrevisaoSaida) : undefined,
    ...values,
  };
}

export function ModalEmitirFormularioSchengen({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
  cliente,
  data,
}: ModalEmitirFormularioSchengenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormularioSchengenFormValues>(
    getInitialValues(initialValues, cliente, data)
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormularioSchengenFormValues, string>>>({});

  const initialValuesRef = useRef(initialValues);
  const clienteRef = useRef(cliente);
  const dataRef = useRef(data);
  initialValuesRef.current = initialValues;
  clienteRef.current = cliente;
  dataRef.current = data;

  useEffect(() => {
    if (open) {
      setFormData(getInitialValues(initialValuesRef.current, clienteRef.current, dataRef.current));
      setErrors({});
    }
  }, [open]);

  const handleTextChange = (field: keyof FormularioSchengenFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (field: keyof FormularioSchengenFormValues, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckboxChange = (field: keyof FormularioSchengenFormValues, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormularioSchengenFormValues, string>> = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!data?.cliente?.id && !cliente?.id) return;
    const clienteId = data?.cliente?.id ?? cliente?.id;

    if (!validateForm()) {
      toast.warning("Por favor, corrija os erros no formulário.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...data,
        cliente: null,
        cliente_id: clienteId,
        objetivo_viagem: data?.subtipo,
        info_suplementar_objetivo: data?.objectivoViagem,
        residencia_outro_pais: formData.residencia_outro_pais,
        autorizacao_residencia: formData.autorizacao_residencia,
        num_autorizacao_residencia: formData.num_autorizacao_residencia,
        validade_autorizacao_residencia: formatDateForPayload(formData.validade_autorizacao_residencia),
        atividade_profissional: formData.atividade_profissional,
        empregador_nome: formData.empregador_nome,
        empregador_endereco: formData.empregador_endereco,
        empregador_telefone: formData.empregador_telefone,
        parentesco_ue: formData.parentesco_ue,
        parentesco_outro: formData.parentesco_outro,
        outro_objectivo_viagem: formData.outro_objectivo_viagem,
        data_prevista_chegada: formatDateForPayload(formData.data_prevista_chegada),
        data_prevista_saida: formatDateForPayload(formData.data_prevista_saida),
        despesas_proprio: formData.despesas_proprio,
        despesas_garante: formData.despesas_garante,
        despesas_dinheiro: formData.despesas_dinheiro,
        despesas_cheques: formData.despesas_cheques,
        despesas_cartoes: formData.despesas_cartoes,
        despesas_alojamento: formData.despesas_alojamento,
        despesas_transporte: formData.despesas_transporte,
        despesas_alojamento_fornecido: formData.despesas_alojamento_fornecido,
        despesas_todas_cobertas: formData.despesas_todas_cobertas,
        despesas_outro_especificar: formData.despesas_outro_especificar,
        despesas_dinheiro_garante: formData.despesas_dinheiro_garante,
        despesas_transporte_garante: formData.despesas_transporte_garante,
        despesas_garante_outro_especificar: formData.despesas_garante_outro_especificar,
      };

      const response = await api.post("formulario-schengen/gerar-pdf", payload, {
        responseType: "blob",
      });

      const contentType = String(response.headers['content-type']) || '';
      if (!contentType.includes('application/pdf')) {
        const text = await response.data.text();
        console.error('Resposta não é PDF:', text.substring(0, 500));
        throw new Error('Erro ao gerar formulário. Tente novamente.');
      }

      if (response.data.size === 0) {
        throw new Error('Erro ao gerar formulário. Tente novamente.');
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `formulario_schengen.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Formulário Schengen emitido com sucesso!");
      onSuccess?.(url);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text();
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.message || "Erro ao gerar PDF");
        } catch {
          toast.error("Erro ao gerar PDF. Tente novamente.");
        }
      } else {
        toast.error(error.message || "Erro ao gerar PDF. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!data?.cliente?.id && !cliente?.id) return;
    const clienteId = data?.cliente?.id ?? cliente?.id;

    setIsLoading(true);

    try {
      const payload = {
        ...data,
        cliente: null,
        cliente_id: clienteId,
        objetivo_viagem: data?.subtipo,
        info_suplementar_objetivo: data?.objectivoViagem,
        residencia_outro_pais: false,
        autorizacao_residencia: "",
        num_autorizacao_residencia: "",
        validade_autorizacao_residencia: "",
        atividade_profissional: "",
        empregador_nome: "",
        empregador_endereco: "",
        empregador_telefone: "",
        parentesco_ue: formData.parentesco_ue,
        parentesco_outro: formData.parentesco_outro,
        outro_objectivo_viagem: "",
        data_prevista_chegada: "",
        data_prevista_saida: "",
        despesas_proprio: false,
        despesas_garante: true,
        despesas_dinheiro: false,
        despesas_cheques: false,
        despesas_cartoes: false,
        despesas_alojamento: false,
        despesas_transporte: false,
        despesas_alojamento_fornecido: false,
        despesas_todas_cobertas: false,
        despesas_outro_especificar: "",
        despesas_dinheiro_garante: false,
        despesas_transporte_garante: false,
        despesas_garante_outro_especificar: "",
      };

      const response = await api.post("formulario-schengen/gerar-pdf", payload, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `formulario_schengen_${data?.cliente?.nome || cliente?.nome || "cliente"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Formulário Schengen baixado novamente!");
    } catch (error: any) {
      console.error("Erro ao baixar formulário Schengen:", error);
      toast.error("Erro ao baixar formulário Schengen");
    } finally {
      setIsLoading(false);
    }
  };

  const inputDateClass = cn(
    "h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
    "bg-transparent text-gray-800 dark:text-white/90",
    "border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[75vw] lg:max-w-[65vw] xl:max-w-[55vw] max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-gray-200 dark:border-white/5">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Emitir Formulário Schengen
            </DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para gerar o formulário de visto Schengen.
              Os dados pessoais (nome, passaporte, etc.) serão preenchidos automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 py-4">
            {/* Seção: Residência */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Residência</h3>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="residencia_outro_pais"
                  checked={formData.residencia_outro_pais}
                  onChange={(e) => handleCheckboxChange("residencia_outro_pais", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="residencia_outro_pais" className="cursor-pointer">
                  Residência noutro país
                </Label>
              </div>
            </div>

            {formData.residencia_outro_pais && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="autorizacao_residencia">Autorização de Residência</Label>
                  <Input
                    id="autorizacao_residencia"
                    value={formData.autorizacao_residencia}
                    onChange={(e) => handleTextChange("autorizacao_residencia", e.target.value)}
                    placeholder="Autorização de Residência nº"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num_autorizacao_residencia">Nº Autorização</Label>
                  <Input
                    id="num_autorizacao_residencia"
                    value={formData.num_autorizacao_residencia}
                    onChange={(e) => handleTextChange("num_autorizacao_residencia", e.target.value)}
                    placeholder="AR-2020-12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validade_autorizacao_residencia">Validade</Label>
                  <input
                    type="date"
                    id="validade_autorizacao_residencia"
                    value={formData.validade_autorizacao_residencia ? format(formData.validade_autorizacao_residencia, "yyyy-MM-dd") : ""}
                    onChange={(e) => handleDateChange("validade_autorizacao_residencia", e.target.value ? new Date(e.target.value) : undefined)}
                    className={inputDateClass}
                  />
                </div>
              </>
            )}

            {/* Seção: Atividade Profissional */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Atividade Profissional</h3>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="atividade_profissional">Atividade / Ocupação atual</Label>
              <Input
                id="atividade_profissional"
                value={formData.atividade_profissional}
                onChange={(e) => handleTextChange("atividade_profissional", e.target.value)}
                placeholder="Ex: Estudante, Empregado, Reformado"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empregador_nome">Empregador / Estabelecimento de ensino</Label>
              <Input
                id="empregador_nome"
                value={formData.empregador_nome}
                onChange={(e) => handleTextChange("empregador_nome", e.target.value)}
                placeholder="Nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empregador_endereco">Endereço</Label>
              <Input
                id="empregador_endereco"
                value={formData.empregador_endereco}
                onChange={(e) => handleTextChange("empregador_endereco", e.target.value)}
                placeholder="Endereço do empregador"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empregador_telefone">Telefone</Label>
              <Input
                id="empregador_telefone"
                value={formData.empregador_telefone}
                onChange={(e) => handleTextChange("empregador_telefone", e.target.value)}
                placeholder="Telefone"
              />
            </div>

            {/* Seção: Parentesco */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Parentesco (Membro UE/EEE/CH)</h3>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentesco_ue">Parentesco</Label>
              <select
                id="parentesco_ue"
                value={formData.parentesco_ue}
                onChange={(e) => handleTextChange("parentesco_ue", e.target.value)}
                className="h-9 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden bg-transparent dark:bg-gray-800 text-gray-800 dark:text-white/90 border-gray-300 dark:border-white/10 focus:border-brand-300 focus:ring-brand-500/20"
              >
                <option value="">Selecionar...</option>
                <option value="conjuge">Cônjuge</option>
                <option value="filho">Filho</option>
                <option value="neto">Neto</option>
                <option value="ascendente">Ascendente</option>
                <option value="parceria">Parceria</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {formData.parentesco_ue === 'outro' && (
              <div className="space-y-2">
                <Label htmlFor="parentesco_outro">Parentesco (outro, especificar)</Label>
                <Input
                  id="parentesco_outro"
                  value={formData.parentesco_outro}
                  onChange={(e) => handleTextChange("parentesco_outro", e.target.value)}
                  placeholder="Especificar parentesco"
                />
              </div>
            )}

            {/* Seção: Datas */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Datas de Viagem</h3>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_prevista_chegada">Data Prevista de Chegada ao Espaço Schengen</Label>
              <input
                type="date"
                id="data_prevista_chegada"
                value={formData.data_prevista_chegada ? format(formData.data_prevista_chegada, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_prevista_chegada", e.target.value ? new Date(e.target.value) : undefined)}
                className={inputDateClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_prevista_saida">Data Prevista de Saída</Label>
              <input
                type="date"
                id="data_prevista_saida"
                value={formData.data_prevista_saida ? format(formData.data_prevista_saida, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange("data_prevista_saida", e.target.value ? new Date(e.target.value) : undefined)}
                className={inputDateClass}
              />
            </div>

            {data?.subtipo === 'outro' && (
              <div className="space-y-2">
                <Label htmlFor="outro_objectivo_viagem">Objetivo da Viagem (outro, especificar)</Label>
                <Input
                  id="outro_objectivo_viagem"
                  value={formData.outro_objectivo_viagem}
                  onChange={(e) => handleTextChange("outro_objectivo_viagem", e.target.value)}
                  placeholder="Especificar objetivo"
                />
              </div>
            )}

            {/* Seção: Despesas */}
            <div className="col-span-full mt-4 mb-2">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Download className="h-4 w-4 text-primary" />
                <h3 className="text-md font-semibold">Despesas</h3>
              </div>
            </div>

            <div className="col-span-full mb-2">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Responsável pelas Despesas</h4>
            </div>

            <div className="col-span-full flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="responsavel_despesas"
                  checked={formData.despesas_proprio}
                  onChange={() => {
                    setFormData((prev) => ({
                      ...prev,
                      despesas_proprio: true,
                      despesas_garante: false,
                    }))
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm font-medium">Próprio</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="responsavel_despesas"
                  checked={formData.despesas_garante}
                  onChange={() => {
                    setFormData((prev) => ({
                      ...prev,
                      despesas_proprio: false,
                      despesas_garante: true,
                    }))
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm font-medium">Garante</span>
              </label>
            </div>

            {formData.despesas_proprio && (
              <>
                <div className="col-span-full mt-3 mb-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Meios Financeiros (Próprio)</h4>
                </div>
                <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { field: "despesas_dinheiro" as const, label: "Dinheiro líquido" },
                    { field: "despesas_cheques" as const, label: "Cheques de viagem" },
                    { field: "despesas_cartoes" as const, label: "Cartões de crédito" },
                    { field: "despesas_alojamento" as const, label: "Alojamento pré-pago" },
                    { field: "despesas_transporte" as const, label: "Transporte pré-pago" },
                  ].map(({ field, label }) => (
                    <div key={field} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={field}
                        checked={formData[field] as boolean}
                        onChange={(e) => handleCheckboxChange(field, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={field} className="cursor-pointer text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="despesas_outro_especificar">Outro (especificar)</Label>
                  <Input
                    id="despesas_outro_especificar"
                    value={formData.despesas_outro_especificar}
                    onChange={(e) => handleTextChange("despesas_outro_especificar", e.target.value)}
                    placeholder="Especifique outro meio"
                  />
                </div>
              </>
            )}

            {formData.despesas_garante && (
              <>
                <div className="col-span-full mt-3 mb-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Meios Financeiros (Garante)</h4>
                </div>
                <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { field: "despesas_dinheiro_garante" as const, label: "Dinheiro líquido" },
                    { field: "despesas_alojamento_fornecido" as const, label: "Alojamento fornecido" },
                    { field: "despesas_todas_cobertas" as const, label: "Todas as despesas cobertas" },
                    { field: "despesas_transporte_garante" as const, label: "Transporte pré-pago" },
                  ].map(({ field, label }) => (
                    <div key={field} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={field}
                        checked={formData[field] as boolean}
                        onChange={(e) => handleCheckboxChange(field, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={field} className="cursor-pointer text-sm">{label}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="despesas_garante_outro_especificar">Outro (especificar)</Label>
                  <Input
                    id="despesas_garante_outro_especificar"
                    value={formData.despesas_garante_outro_especificar}
                    onChange={(e) => handleTextChange("despesas_garante_outro_especificar", e.target.value)}
                    placeholder="Especifique"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDownload}
              disabled={isLoading}
              variant="secondary"
              className="gap-2 w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-2 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Emitir Formulário Schengen
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
