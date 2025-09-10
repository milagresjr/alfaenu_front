"use client";

import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { SelectClient } from "./SelectClient";
import { useEffect, useState } from "react";
import { ClienteType } from "@/features/client/types";
import { useTermos } from "@/features/term/hooks/useTermosQuery";
import { all } from "axios";
import { useServicos } from "@/features/service/hooks/useServicesQuery";
import { Eye, File, Plus, Trash } from "lucide-react";
import { ServiceType } from "@/features/service/types";
import { toast } from "react-toastify";
import { useContratoStore } from "../store/useContratoStore";
import { ModalTermo } from "./ModalTermo";
import { useCreateContrato, useUpdateContrato } from "../hooks/useContractQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { alert } from "@/lib/alert";
import { api } from "@/services/api";
import SelectServices from "./SelectService";
import PdfPreview from "./PdfPreview";
import { ContratoType } from "../types";
import { AssinaturaCliente } from "./AssinaturaCliente";
import { AssinaturaUser } from "./AssinaturaUser";

const schemma = z.object({
    nota: z.string(),
    desconto: z.number(),
    valor_por_pagar: z.number(),
    valor_pago: z.string(),
    termo_id: z.string(),
    cliente_id: z.string(),
    tipo_pagamento: z.string(),
    data_inicio: z.string(),
    assinatura_cliente: z.string(),
    assinatura_user: z.string(),
});

type FormValues = z.infer<typeof schemma>;

export function FormContrato() {

    const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm<z.infer<typeof schemma>>({
        resolver: zodResolver(schemma),
        defaultValues: {
            nota: "",
            desconto: 0,
            valor_por_pagar: 0,
            valor_pago: '0',
            termo_id: '',
            cliente_id: '',
            tipo_pagamento: "",
            data_inicio: new Date().toISOString().split('T')[0],
            assinatura_cliente: "",
            assinatura_user: "",
        }
    });


    const [servicos, setServicos] = useState<ServiceType[]>([
        { id: "", nome: "", valor: 0, valor_externo: 0, tipo: '' }
    ]);

    const [cliente, setCliente] = useState<ClienteType | null>(null);

    const [showPreview, setShowPreview] = useState(false);
    const [loadingPreviewPdf, setLoadingPreview] = useState(false);

    const { data: termos } = useTermos();
    const { data: servicosData } = useServicos();

    const { setOpenModalTermo, setSelectedTermo, assinaturaCliente, assinaturaUser } = useContratoStore();

    const mode = "create";

    const opcoesServicos = servicosData?.data.map((servico) => ({
        value: String(servico.id),
        label: servico.nome
    }))

    const opcoesTermos = termos?.data?.map((termo) => ({
        value: String(termo.id),
        label: termo.titulo,
    }));

    const opcoesTipoPagamento = [
        { value: "pre-pago", label: "Pré-Pago" },
        { value: "pos-pago", label: "Pós-Pago" }
    ];

    const addServico = () => {
        setServicos([...servicos, { id: "", nome: "", valor: 0, valor_externo: 0, tipo: '' }]);
    };

    const removeServico = (index: number) => {
        setServicos(servicos.filter((_, i) => i !== index));
    };

    const updateServico = (index: number, id: string) => {
        const updated = [...servicos];
        const servico = servicosData?.data.find((servico) => Number(servico.id) === Number(id));
        if (!servico) return;
        updated[index].id = servico.id;
        updated[index].nome = servico.nome;
        updated[index].valor = servico.valor;
        updated[index].valor_externo = servico.valor_externo;
        updated[index].tipo = servico.tipo
        setServicos(updated);
    };

    const created = useCreateContrato();

    const idTermo = watch("termo_id");
    const desconto = watch("desconto");

    const totalAPagar = servicos.reduce((acc, servico) => acc + Number(servico?.valor), 0);
    const totalComDesconto = totalAPagar - desconto;
    setValue("valor_por_pagar", totalComDesconto);

    const termoSelecionado = termos?.data.find((termo) => termo.id === Number(idTermo));

    const queryClient = useQueryClient();

    function onSubmit(data: any) {

        if (validacaoForm(data)) {
            return;
        }

        const newData = {
            ...data,
            termo_id: data.termo_id,
            cliente_id: cliente?.id,
            assinatura_cliente: assinaturaCliente,
            assinatura_user: assinaturaUser,
            servicos: servicos
        }

        created.mutate(newData, {
            onSuccess: (response) => {
                toast.success('Contrato criado com sucesso!');
                queryClient.invalidateQueries({
                    queryKey: ["contratos"],
                    exact: false,
                });
                const documentoId = response?.data?.id;
                //route.push('/contract');
                gerarPdfDocumento(documentoId);
                setCliente(null);
                setServicos([
                    { id: "", nome: "", valor: 0, valor_externo: 0, tipo: '' }
                ]);
                setValue("nota", "");
                setValue("desconto", 0);
                setValue("valor_por_pagar", 0);
                setValue("valor_pago", '0');
                setValue("tipo_pagamento", "");
                setValue("data_inicio", new Date().toISOString().split('T')[0]);
                setValue("assinatura_cliente", "");
                setValue("assinatura_user", "");
                setSelectedTermo(null);
                setOpenModalTermo(false);
            },
            onError: (error) => {
                toast.error('Erro ao criar contrato');
                console.error("Erro ao criar contrato:", error);
            },
        });
    }

    function onSubmitPreviewPdf(data: any) {
        if (validacaoForm(data)) {
            return;
        }
        const newData = {
            ...data,
            termo_id: data.termo_id,
            cliente_id: cliente?.id,
            servicos: servicos
        }
        previewPdfDocumento(newData);
    }

    const onError = (errors: any) => {
        console.error("❌ Erros de validação:", errors);
    }

    function validacaoForm(data: any) {
        if (data.tipo_pagamento === 'pre-pago' && data.valor_pago <= 0) {
            toast.error('Informe o valor pago.');
            return true;
        }

        if (!cliente) {
            toast.error('Informe o cliente');
            return true;
        }

        if (data.tipo_pagamento === "") {
            toast.error('Informe o tipo de pagamento');
            return true;
        }

        const servSeleted = servicos.every((servico) => String(servico.id) !== '');
        if (!servSeleted) {
            if (servicos.length > 1) {
                toast.error('Informe todos os serviços');
                return true;
            } else {
                toast.error('Informe o serviço');
                return true;
            }
        }

        if (!data.termo_id) {
            toast.error('Informe o termo');
            return true;
        }

        return false;
    }

    function handleOpenTermoModal() {
        if (!termoSelecionado) {
            toast.error('Selecione o termo');
            return;
        }
        setOpenModalTermo(true);
    }

    async function confirmarCriacaoContrato(e: React.FormEvent) {
        e.preventDefault(); // evita o submit automático do form

        const confirmado = await alert.confirm("Criar Contrato", ``);

        if (confirmado) {
            handleSubmit(onSubmit, onError)(e);
        }
    }

    async function gerarPdfDocumento(documentoId: number | undefined) {
        try {
            const response = await api.get(`contract/${documentoId}/gerar-pdf`, {
                responseType: 'blob', // ⚠️ Muito importante para PDFs
            });

            if (response.status !== 200) {
                console.error("Erro ao gerar PDF:", response);
                throw new Error("Erro ao gerar PDF");
            }

            // Cria uma URL temporária do PDF
            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            // Abre o PDF numa nova aba
            window.open(fileURL, "_blank");

            toast.success("PDF gerado com sucesso!");
        } catch (error) {
            toast.error("Erro ao gerar PDF.");
            console.error(error);
        }
    }

    async function previewPdfDocumento(data: ContratoType) {
        try {
            setLoadingPreview(true);
            const response = await api.post(`contract/preview-pdf`, data, {
                responseType: 'blob', // ⚠️ Muito importante para PDFs
            });

            if (response.status !== 200) {
                toast.error('Erro ao gerar pdf');
                console.error("Erro ao gerar PDF:", response);
                throw new Error("Erro ao gerar PDF");
            }

            // Cria uma URL temporária do PDF
            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            // Abre o PDF numa nova aba
            window.open(fileURL, "_blank");

        } catch (error) {
            toast.error("Erro ao gerar PDF.");
            console.error(error);
            setLoadingPreview(false);
        } finally {
            setLoadingPreview(false);
        }
    }

    useEffect(() => {
        setSelectedTermo(termoSelecionado || null);
    }, [termoSelecionado]);

    useEffect(() => {
        setSelectedTermo(termoSelecionado || null);
    }, [desconto]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
            <h1 className="text-lg my-3 text-gray-700 dark:text-gray-300">{mode === "create" ? "Criar Contrato" : "Editar Contrato"}</h1>
            <form onSubmit={confirmarCriacaoContrato}>

                <div className="flex gap-2">
                    <div className="flex-1 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">

                        <div className="col-span-6">
                            <SelectClient
                                selectedCliente={cliente}
                                onSelectCliente={(clienteSelected) => setCliente(clienteSelected)}
                                error={!cliente}
                            />
                        </div>

                        <div className="col-span-3 ">
                            <Label>Termo</Label>
                            <Controller
                                name="termo_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={opcoesTermos || []}
                                        placeholder="Selecione um termo"
                                        value={String(field.value)}
                                        onChange={field.onChange}
                                        name={field.name}
                                    />
                                )}
                            />

                            {errors.termo_id && (
                                <p className="mt-1.5 text-xs text-error-500">
                                    {errors.termo_id.message}
                                </p>
                            )}
                        </div>

                        <div className="col-span-3">
                            <Label>Desconto</Label>
                            <Input type="text"
                                placeholder="Nome"
                                name="desconto"
                                register={register}
                            />
                            {errors.desconto && (
                                <p className="mt-1.5 text-xs text-error-500">
                                    {errors.desconto.message}
                                </p>
                            )}
                        </div>

                        <div className="col-span-3 ">
                            <Label>Valor por pagar</Label>
                            <Input type="text"
                                placeholder="Descrição"
                                name="valor_por_pagar"
                                register={register}
                                disabled={true}
                            />
                            {errors.valor_por_pagar && (
                                <p className="mt-1.5 text-xs text-error-500">
                                    {errors.valor_por_pagar.message}
                                </p>
                            )}
                        </div>

                        <div className="col-span-3 ">
                            <Label>Valor Pago</Label>
                            <Input type="text"
                                placeholder="Descrição"
                                name="valor_pago"
                                register={register}
                            />
                            {errors.valor_pago && (
                                <p className="mt-1.5 text-xs text-error-500">
                                    {errors.valor_pago.message}
                                </p>
                            )}
                        </div>

                        <div className="col-span-3 ">
                            <Label>Tipo de Pagamento</Label>
                            <Controller
                                name="tipo_pagamento"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={opcoesTipoPagamento || []}
                                        placeholder="Selecione um tipo de pagamento"
                                        value={String(field.value)}
                                        onChange={field.onChange}
                                        name={field.name}
                                    />
                                )}
                            />
                            {errors.tipo_pagamento && (
                                <p className="mt-1.5 text-xs text-error-500">
                                    {errors.tipo_pagamento.message}
                                </p>
                            )}
                        </div>

                        <div className="col-span-3 ">
                            <Controller
                                name="data_inicio"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        id="data_inicio"
                                        label="Data de Início"
                                        defaultDate={field.value ? new Date(field.value) : undefined}
                                        onChange={(selectedDates) => {
                                            const date = selectedDates[0];
                                            if (date) {
                                                // ✅ Formata manualmente em YYYY-MM-DD (sem UTC)
                                                const formatted = date.getFullYear() +
                                                    "-" +
                                                    String(date.getMonth() + 1).padStart(2, "0") +
                                                    "-" +
                                                    String(date.getDate()).padStart(2, "0");

                                                field.onChange(formatted);
                                            } else {
                                                field.onChange("");
                                            }
                                        }}
                                    />
                                )}
                            />

                            {errors.data_inicio && (
                                <p className="mt-1.5 text-xs text-error-500">
                                    {errors.data_inicio.message}
                                </p>
                            )}
                        </div>

                        <div className="col-span-6 ">
                            <Label>Nota</Label>
                            <TextArea
                                placeholder="Nota"
                                name="nota"
                                register={register}
                            />
                            {errors.nota && (
                                <p className="mt-1.5 text-xs text-error-500">
                                    {errors.nota.message}
                                </p>
                            )}
                        </div>

                        <div className="cols-span-6">
                            <div className="flex flex-col xl:flex-row gap-2">
                                <AssinaturaCliente />
                                <AssinaturaUser />
                            </div>
                        </div>


                    </div>

                    <div className="w-[300px] flex flex-col gap-2 border-l pl-2 border-gray-500">
                        {servicos.map((servico, index) => (
                            <div key={index} className="flex items-end gap-1">
                                <div className="flex-1">
                                    <label
                                        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                                    >Serviço {servicos.length > 1 ? `(${index + 1})` : ''}</label>
                                    <SelectServices
                                        value={servico.id!}
                                        onChange={(val) => updateServico(index, val)}
                                        opcoesServicos={opcoesServicos!}
                                        placeholder="Selecione um serviço"
                                    />

                                </div>

                                <div className="w-[20px]">
                                    {servicos.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeServico(index)}
                                            className={`text-red-600 ml-2 ${index === 0 && 'hidden'}`}
                                        >
                                            <Trash size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="flex w-full justify-end">
                            <button
                                type="button"
                                onClick={addServico}
                                className="bg-green-600 text-white p-1 rounded-md cursor-pointer"><Plus /></button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between w-full gap-3 mt-8">
                    <Button
                        onClick={handleSubmit(onSubmitPreviewPdf)}
                        size="sm"
                        className="bg-orange-600 text-white hover:bg-orange-500"
                        startIcon={<File size={14} />}
                    >
                        {`${loadingPreviewPdf ? 'Carregando...' : 'Ver PDf'}`}
                    </Button>
                    <div className="flex gap-2">
                        <Link href={"/client"}>
                            <Button size="sm" variant="outline">
                                Voltar
                            </Button>
                        </Link>
                        <Button size="sm" variant="primary">
                            Salvar
                        </Button>
                    </div>
                </div>

            </form>
            <ModalTermo />
            <div className="p-6">

                {/* <button
                    onClick={() => setShowPreview(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Ver PDF 22
                </button>

                {showPreview && (
                    <PdfPreview
                        fileUrl="blob:http://localhost:3000/207727fd-8267-4887-98c4-73d4c1659707"
                        onClose={() => setShowPreview(false)}
                    />
                )} */}
            </div>
        </div>
    )
}