"use client";

import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui-old/button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import z, { set } from "zod";
import { SelectClient } from "./SelectClient";
import { useEffect, useState } from "react";
import { ClienteType } from "@/features/client/types";
import { useTermos } from "@/features/term/hooks/useTermosQuery";
import { useServicos } from "@/features/service/hooks/useServicesQuery";
import { ChevronDown, ChevronLeft, File, Trash2 } from "lucide-react";
import { ServiceType } from "@/features/service/types";
import { toast } from "react-toastify";
import { useContratoStore } from "../store/useContratoStore";
import { useQueryClient } from "@tanstack/react-query";
import { alert } from "@/lib/alert";
import { api } from "@/services/api";
import SelectServices from "./SelectService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ContratoType, SubcontaType } from "../types";
import BottomOffCanvas from "./BottonOffCanvas";
import { useProgress } from "@bprogress/next";
import { useRouter } from "next/navigation";
import { useCreateContrato } from "../hooks/useContractQuery";
import { gerarPdfContrato } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatarMoeda } from "@/lib/helpers";
import { MultiSelect } from "@/components/multi-select/multi-select";
import DialogContratoCreated from "./DialogContratoCreated";

const schemma = z.object({
    nota: z.string(),
    desconto: z.string(),
    valor_por_pagar: z.number(),
    valor_pago: z.string(),
    termo_id: z.string(),
    cliente_id: z.string(),
    // tipo_pagamento: z.string(),
    data_inicio: z.string(),
    assinatura_cliente: z.string(),
    assinatura_user: z.string(),
});

//type FormValues = z.infer<typeof schemma>;


export function FormContrato() {

    const { register, handleSubmit, formState: { errors }, control, setValue, watch, getValues } = useForm<z.infer<typeof schemma>>({
        resolver: zodResolver(schemma),
        defaultValues: {
            nota: "",
            desconto: '0',
            valor_por_pagar: 0,
            valor_pago: '0',
            termo_id: '',
            cliente_id: '',
            // tipo_pagamento: "",
            data_inicio: new Date().toISOString().split('T')[0],
            assinatura_cliente: "",
            assinatura_user: "",
        }
    });


    const [subcontas, setSubcontas] = useState<SubcontaType[]>([
        { id: "1", nome: "Subconta 1", especificacao: '', servicos: [] }
    ]);

    const [subcontasSalvas, setSubcontasSalvas] = useState<SubcontaType[]>([
        { id: "1", nome: "Subconta 1", especificacao: '', servicos: [] }
    ]);

    const [activeTab, setActiveTab] = useState("1")

    const [cliente, setCliente] = useState<ClienteType | null>(null);

    const [loadingPreviewPdf, setLoadingPreview] = useState(false);

    const [openSheet, setOpenSheet] = useState(false);
    const [openModalNota, setOpenModalNota] = useState(false);

    const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
    const [openDialogCreated, setOpenDialogCreated] = useState(false);

    const [idContratoCreated, setIdContratoCreated] = useState<number | null>(null);

    const [notaSalva, setNotaSalva] = useState<string>("");
    const [notaSaved, setNotaSaved] = useState(false);

    const [servicosSaved, setServicosSaved] = useState(false);

    const progress = useProgress();

    const router = useRouter();

    const { data: termos } = useTermos();
    const { data: servicosData } = useServicos({ estado: "ativo" });

    const { setOpenModalTermo, setSelectedTermo, assinaturaCliente, assinaturaUser, setOpenOffCanvas } = useContratoStore();

    const mode = "create";

    const opcoesServicos = servicosData?.data.map((servico) => ({
        value: String(servico.id),
        label: servico.nome
    }))

    const opcoesTermos = termos?.data?.map((termo) => ({
        value: String(termo.id),
        label: termo.titulo,
    }));

    // const opcoesTipoPagamento = [
    //     { value: "pre-pago", label: "Pré-Pago" },
    //     { value: "pos-pago", label: "Pós-Pago" }
    // ];

    // Adicionar subconta
    const addSubconta = () => {
        const newId = String(subcontas.length + 1)
        setSubcontas([
            ...subcontas,
            { id: newId, nome: `Subconta ${newId}`, especificacao: '', servicos: [] }
        ])
    }

    const removeSubconta = () => {
        setSubcontas((prev) => prev.slice(0, -1));
    };

    // Adicionar serviço numa subconta
    const addServico = (subcontaId: string) => {
        setSubcontas(prev =>
            prev.map(s =>
                s.id === subcontaId
                    ? {
                        ...s,
                        servicos: [
                            ...s.servicos,
                            { id: "", nome: "", valor: 0, valor_externo: 0, tipo: "" }
                        ]
                    }
                    : s
            )
        )
    }

    // Remover serviço numa subconta
    const removeServico = (subcontaId: string, index: number) => {
        setSubcontas(prev =>
            prev.map(s =>
                s.id === subcontaId
                    ? {
                        ...s,
                        servicos: s.servicos.filter((_, i) => i !== index)
                    }
                    : s
            )
        )
    }

    const updateSubcontaNome = (id: string, novoNome: string) => {
        setSubcontas(prev =>
            prev.map(s =>
                s.id === id
                    ? { ...s, nome: novoNome }
                    : s
            )
        )
    }

    const updateSubcontaEspeci = (id: string, novaEspecificacao: string) => {
        setSubcontas(prev =>
            prev.map(s =>
                s.id === id
                    ? { ...s, especificacao: novaEspecificacao }
                    : s
            )
        )
    }

    // Atualizar serviço numa subconta
    const updateServico = (subcontaId: string, index: number, id: string) => {
        const servico = servicosData?.data.find(s => Number(s.id) === Number(id))
        if (!servico) return

        setSubcontas(prev =>
            prev.map(s =>
                s.id === subcontaId
                    ? {
                        ...s,
                        servicos: s.servicos.map((sv, i) =>
                            i === index
                                ? {
                                    id: servico.id,
                                    nome: servico.nome,
                                    valor: Number(servico.valor),
                                    valor_externo: servico.valor_externo,
                                    tipo: servico.tipo
                                }
                                : sv
                        )
                    }
                    : s
            )
        )
    }

    const created = useCreateContrato();

    const idTermo = watch("termo_id");
    const desconto = watch("desconto");

    // const totalAPagar = subcontas.reduce((acc, subconta) => {
    //     const subtotal = subconta.servicos.reduce((soma, servico) => soma + Number(servico.valor), 0);
    //     return acc + subtotal;
    // }, 0);


    // function totalPorSubconta(idSubconta: string) {
    //     const total = subcontas.find((subconta) => subconta.id === idSubconta)?.servicos.reduce((acc, servico) => {
    //         return acc + Number(servico.valor);
    //     }, 0);
    //     return total;
    // }

    // Filtra os serviços selecionados

    const servicosSelecionadosData = servicosData?.data.filter((servico) =>
        servicosSelecionados.includes(String(servico.id))
    );

    // Soma os valores
    const totalServicos = servicosSelecionadosData?.reduce(
        (acc, servico) => acc + Number(servico.valor),
        0
    );

    const totalComDesconto = Number(totalServicos) - Number(desconto);

    setValue("valor_por_pagar", totalComDesconto);

    const termoSelecionado = termos?.data.find((termo) => termo.id === Number(idTermo));

    const queryClient = useQueryClient();

    async function onSubmit(data: any) {

        if (validacaoForm(data)) {
            return;
        }

        const erros = validarSubcontas(subcontas)

        if (erros.length > 0) {
            erros.forEach(item => {
                toast.error(item);
            })
            return
        }

        const newData = {
            ...data,
            nota: notaSalva,
            termo_id: data.termo_id,
            cliente_id: cliente?.id,
            assinatura_cliente: assinaturaCliente,
            assinatura_user: assinaturaUser,
            servicos: servicosSelecionadosData,
            subcontas: subcontas
        }

        // console.log(newData);
        // return;

        created.mutate(newData, {
            onSuccess: (response) => {
                toast.success('Contrato criado com sucesso!');
                queryClient.invalidateQueries({
                    queryKey: ["contratos"],
                    exact: false,
                });
                const documentoId = response?.data?.id;
                setIdContratoCreated(documentoId || null);
                //limpar campos
                limparCampos();
                setOpenDialogCreated(true);
                // progress.start();
                // router.push('/contract');
            },
            onError: (error) => {
                toast.error('Erro ao criar contrato');
                console.error("Erro ao criar contrato:", error);
            },
        });
    }

    function limparCampos() {
        setCliente(null);
        setServicosSelecionados([]);
        setSubcontas([
            { id: "1", nome: "Subconta 1", especificacao: '', servicos: [] }
        ]);
        setSubcontasSalvas([
            { id: "1", nome: "Subconta 1", especificacao: '', servicos: [] }
        ]);
        setValue("nota", "");
        setValue("desconto", '0');
        setValue("valor_por_pagar", 0);
        setValue("valor_pago", '0');
        // setValue("tipo_pagamento", "");
        setValue("data_inicio", new Date().toISOString().split('T')[0]);
        setValue("assinatura_cliente", "");
        setValue("assinatura_user", "");
        setSelectedTermo(null);
    }

    function onSubmitPreviewPdf(data: any) {
        if (validacaoForm(data)) {
            return;
        }

        const erros = validarSubcontas(subcontas)

        if (erros.length > 0) {
            erros.forEach(item => {
                toast.error(item);
            })
            return
        }

        const newData = {
            ...data,
            termo_id: data.termo_id,
            cliente_id: cliente?.id,
            subcontas: subcontas
        }
        previewPdfDocumento(newData);
    }

    const onError = (errors: any) => {
        console.error("❌ Erros de validação:", errors);
    }

    function salvarServicos() {
        const erros = validarSubcontas(subcontas)

        if (erros.length > 0) {
            erros.forEach(item => {
                toast.error(item);
            })
            return
        }
        setSubcontasSalvas([...subcontas]);
        setServicosSaved(true);
        toast.success('Subcontas salva com sucesso!');
        setOpenSheet(false);
    }

    function handleOpenSheetServicos() {
        setOpenSheet(true);
        if (servicosSaved) {
            setSubcontas(subcontasSalvas);
        }
    }

    function handleCloseSheetServicos(open: boolean) {
        setOpenSheet(open);
        if (!servicosSaved) {
            setSubcontas([
                { id: "1", nome: "Subconta 1", servicos: [] }
            ]);
        }
    }

    function handleOpenDialogNota() {
        setOpenModalNota(true);
        if (notaSaved) {
            setValue("nota", notaSalva);
        }
    }

    function handleCloseDialogNota(open: boolean) {
        setOpenModalNota(open);
        if (!notaSaved) {
            console.log("nota n foi salva");
            setValue("nota", "");
        }
    }

    function validacaoForm(data: any) {
        // if (data.tipo_pagamento === 'pre-pago' && data.valor_pago <= 0) {
        //     toast.error('Informe o valor pago.');
        //     return true;
        // }

        if (!cliente) {
            toast.error('Informe o cliente');
            return true;
        }

        // if (data.tipo_pagamento === "") {
        //     toast.error('Informe o tipo de pagamento');
        //     return true;
        // }

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

    // Função de validação
    const validarSubcontas = (subcontas: SubcontaType[]): string[] => {
        const erros: string[] = []

        subcontas.forEach((sub, i) => {
            // 1- Subconta sem serviço
            // if (sub.servicos.length === 0) {
            //     erros.push(`A subconta ${i + 1} (${sub.nome}) deve ter ao menos 1 serviço.`)
            // }

            // 2- Serviço sem seleção
            // sub.servicos.forEach((serv: ServiceType, j: number) => {
            //     if (!serv.id || String(serv.id).trim() === "") {
            //         erros.push(`O serviço ${j + 1} da subconta ${i + 1} (${sub.nome}) não foi selecionado.`)
            //     }
            // });

            // 3- Subconta sem nome
            if (!sub.nome || sub.nome.trim() === "") {
                erros.push(`A subconta ${i + 1} não possui nome.`)
            }

            // 4- Subconta com nome repetido
            const nomesSubcontas = subcontas.map(s => s.nome.trim().toLowerCase());
            const nomeAtual = sub.nome.trim().toLowerCase();
            const ocorrencias = nomesSubcontas.filter(nome => nome === nomeAtual).length;
            if (ocorrencias > 1) {
                erros.push(`O nome "${sub.nome}" da subconta ${i + 1} está repetido. Cada subconta deve ter um nome único.`)
            }

            // 5- Subconta com especificação vazia
            if (!sub.especificacao || sub.especificacao.trim() === "") {
                erros.push(`A subconta ${i + 1} (${sub.nome}) deve ter uma especificação.`)
            }

        })

        return erros
    }

    function handleBack() {
        progress.start();
        router.back();
    }

    useEffect(() => {
        setSelectedTermo(termoSelecionado || null);
    }, [termoSelecionado]);

    useEffect(() => {
        setSelectedTermo(termoSelecionado || null);
    }, [desconto]);

    return (
        <div className="flex flex-col md:flex-row md:justify-between gap-4">

            <div className="flex-1 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">

                <div className="flex justify-start">
                    <span onClick={handleBack} className="text-blue-600 cursor-pointer flex items-center ga-2">
                        <ChevronLeft size={18} />
                        <span>Voltar</span>
                    </span>
                </div>

                <form onSubmit={confirmarCriacaoContrato}>

                    <div className="flex flex-wrap justify-between items-center mb-3">
                        <h1 className="text-lg my-3 text-gray-700 dark:text-gray-300">{mode === "create" ? "Criar Contrato" : "Editar Contrato"}</h1>

                        <div className="flex flex-wrap gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="h-[40px] flex items-center gap-2 border px-3
                                bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 
                                dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] 
                                dark:hover:text-gray-300 font-medium rounded-lg transition
                                ">
                                        Opções <ChevronDown />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Mais opções</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleOpenDialogNota}>
                                        Adicionar Notas
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button className="h-[40px]" onClick={handleOpenSheetServicos} size="sm" type="button" variant="outline">
                                + Adicionar Subcontas
                            </Button>
                            <Button className="w-auto h-[40px]" size="sm" variant="primary" type="submit">
                                Salvar
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">

                            <div className="col-span-6 md:col-span-3">
                                <SelectClient
                                    selectedCliente={cliente}
                                    onSelectCliente={(clienteSelected) => setCliente(clienteSelected)}
                                    error={!cliente}
                                />
                            </div>

                            <div className="col-span-6 md:col-span-3 ">
                                <Label>Termo</Label>
                                <div className="flex items-center gap-2">
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
                                    <button className="cursor-pointer" onClick={handleSubmit(onSubmitPreviewPdf)}>
                                        <File />
                                    </button>
                                </div>

                                {errors.termo_id && (
                                    <p className="mt-1.5 text-xs text-error-500">
                                        {errors.termo_id.message}
                                    </p>
                                )}
                            </div>

                            {/* <div className="col-span-6 md:col-span-3 ">
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
                            </div> */}

                            <div className="col-span-6 md:col-span-3">
                                <Label>Serviços</Label>
                                <div className="p-0.5">
                                    <MultiSelect
                                        options={opcoesServicos!}
                                        selected={servicosSelecionados}
                                        onChange={setServicosSelecionados}
                                        placeholder="Selecione serviços"
                                    />
                                </div>
                            </div>

                            {/* <div className="col-span-6 md:col-span-3 ">
                                <Label>Valor Pago</Label>
                                <Input type="text"
                                    placeholder="Valor total pago"
                                    name="valor_pago"
                                    register={register}
                                />
                                {errors.valor_pago && (
                                    <p className="mt-1.5 text-xs text-error-500">
                                        {errors.valor_pago.message}
                                    </p>
                                )}
                            </div> */}

                            <div className="col-span-6 md:col-span-3">
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

                            {/* <div className="col-span-6 md:col-span-3 hidden">
                                <Label>Valor por pagar</Label>
                                <Input type="text"
                                    placeholder="Valor por se pagar"
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

                            <div className="col-span-6 md:col-span-3 ">
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
                            </div> */}

                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:justify-between w-full gap-3 mt-8">
                        <Button className="w-full md:w-auto bg-red-600 text-white hover:bg-red-500" onClick={() => setOpenOffCanvas(true)} size="sm" type="button">
                            + Adicionar Assinatura
                        </Button>

                    </div>


                    <Dialog open={openModalNota} onOpenChange={handleCloseDialogNota}>
                        <DialogContent className="z-9999">
                            <DialogHeader>
                                <DialogTitle>Nota</DialogTitle>
                                <DialogDescription asChild>
                                    <div className="flex flex-col gap-2">
                                        <div className="col-span-6 md:col-span-3">
                                            <TextArea
                                                placeholder="Descreva uma nota"
                                                name="nota" register={register}
                                            />
                                            {/* {errors.nota && (
                                            <p className="mt-1.5 text-xs text-error-500">
                                            {errors.nota.message}
                                            </p>
                                        )} */}
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={handleSubmit((data) => {
                                                    console.log("Nota salva:", data.nota);
                                                    setNotaSalva(data.nota);
                                                    setNotaSaved(true);
                                                    setOpenModalNota(false);
                                                })}
                                                className="px-2 py-2 bg-green-600 text-white text-sm rounded-md"
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                </form>

                <Sheet open={openSheet} onOpenChange={handleCloseSheetServicos}>
                    <SheetContent className="w-full z-999 dark:bg-gray-900 overflow-y-auto custom-scrollbar">
                        <SheetHeader>
                            <SheetTitle className="mb-4 pb-2 border-b">Sub-contas</SheetTitle>
                            <SheetDescription asChild className="">
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="flex flex-wrap items-center">
                                        {subcontas.map((subconta) => (
                                            <TabsTrigger key={subconta.id} value={subconta.id}>
                                                {subconta.nome && `${subconta.nome}`}
                                            </TabsTrigger>
                                        ))}
                                        <div className={`flex items-center gap-1`}>
                                            <button
                                                type="button"
                                                onClick={removeSubconta}
                                                className={`
                                    ml-2 p-2 rounded-md
             bg-red-100 text-red-700
             hover:bg-red-200
             dark:bg-red-900 dark:text-red-300
             dark:hover:bg-red-800
             transition-colors shadow-sm
             ${subcontas.length === 1 ? 'hidden' : ''}
                                    `}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={addSubconta}
                                                className={`
                                        px-3 py-1.5 rounded-md text-sm font-medium
             bg-gray-200 text-gray-700
             hover:bg-gray-300
             dark:bg-gray-700 dark:text-gray-200
             dark:hover:bg-gray-600
             transition-colors shadow-sm
             ${subcontas.length === 1 && 'ml-2'}
                                        `}
                                            >
                                                + Subconta
                                            </button>
                                        </div>
                                    </TabsList>

                                    {subcontas.map((s) => (
                                        <TabsContent value={s.id} key={s.id} className="space-y-3  border p-4 rounded-md mt-3">
                                            <h3 className="font-semibold">{s.nome}</h3>
                                            <div className="mb-3">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Nome da Subconta
                                                </label>
                                                <input
                                                    type="text"
                                                    value={s.nome}
                                                    onChange={(e) => updateSubcontaNome(s.id, e.target.value)}
                                                    placeholder="Digite o nome da subconta"
                                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="mb-5 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Especificação
                                                </label>
                                                <textarea
                                                    placeholder="Descreva uma especificação para esta subconta"
                                                    value={s.especificacao}
                                                    rows={4}
                                                    onChange={(e) => updateSubcontaEspeci(s.id, e.target.value)}
                                                    className={`
                                                        w-full mt-2 rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none
                                                        bg-transparent text-gray-400 border-gray-300 focus:border-brand-300 focus:ring 
                                                        focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800
                                                    `}
                                                />
                                            </div>

                                            {/* {s.servicos.map((servico, index) => (
                                                <div key={index} className="flex flex-col gap-0">
                                                    <label className="mb-1.5 block text-sm font-medium">
                                                        Serviço {s.servicos.length > 1 ? `(${index + 1})` : ""}
                                                    </label>
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex-1">
                                                            <SelectServices
                                                                value={servico.id!}
                                                                onChange={(val) => updateServico(s.id, index, val)}
                                                                opcoesServicos={opcoesServicos!}
                                                                placeholder="Selecione um serviço"
                                                            />
                                                        </div>

                                                        <div className="flex gap-2">
                                                            {index === 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addServico(s.id)}
                                                                    className="text-green-600"
                                                                >
                                                                    +
                                                                </button>
                                                            )}
                                                            {index > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeServico(s.id, index)}
                                                                    className="text-red-600"
                                                                >
                                                                    x
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))} */}

                                            {/* <button
                                                type="button"
                                                onClick={() => addServico(s.id)}
                                                className="text-blue-600 mt-2"
                                            >
                                                + Adicionar Serviço
                                            </button>
                                            <div>
                                                <span className="font-medium text-sm">Total: </span>
                                                <span className="font-medium text-sm">{totalPorSubconta(s.id)}</span>
                                            </div> */}
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </SheetDescription>
                        </SheetHeader>

                        {/* Botão pra fechar */}
                        {/* <Button variant="outline" onClick={() => setOpenSheet(false)} className="mt-4 w-fit absolute right-4 bottom-2">
                        Fechar
                    </Button> */}
                        <div className="flex justify-end pr-3">
                            <button
                                type="button"
                                onClick={salvarServicos}
                                className="px-2 py-2 bg-green-600 text-white text-sm rounded-md"
                            >
                                Salvar
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>

                <BottomOffCanvas />
            </div>

            <div className="w-full md:w-40 lg:w-66">
                <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm p-5 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Resumo do Pagamento
                    </h2>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Total de serviços</span>
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                            {formatarMoeda(Number(totalServicos)) || 0}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Desconto</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                            {formatarMoeda(Number(desconto)) || 0}
                        </span>
                    </div>

                    {/* <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Valor Pago</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                            {formatarMoeda(Number(watch("valor_pago"))) || 0}
                        </span>
                    </div> */}

                    <div className="border-t border-gray-200 dark:border-white/[0.08] pt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Valor Total
                        </span>
                        <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                            {(
                                formatarMoeda(totalComDesconto) ||
                                0
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <DialogContratoCreated
                open={openDialogCreated}
                onOpenChange={setOpenDialogCreated}
                idContract={idContratoCreated!}
                onPrintContract={() => {
                    if (idContratoCreated) {
                        gerarPdfContrato(idContratoCreated);
                    } else {
                        toast.error("ID do contrato não disponível.");
                    }
                }}
                // onOpenContract={() => router.push(`/contract/${idContratoCreated}`)}
                contractName={watch("termo_id") ? opcoesTermos?.find(t => t.value === String(watch("termo_id")))?.label : "Contrato"}
            />

        </div>
    )
}