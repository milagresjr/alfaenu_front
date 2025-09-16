"use client";

import Editor from "@/components/editor/editor";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useTermoStore } from "../store/useTermoStore";
import EditorConteudo from "./EditorConteudo";
import { useCreateTermo, useUpdateTermo } from "../hooks/useTermosQuery";
import { useQueryClient } from "@tanstack/react-query";
import { alert } from "@/lib/alert";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/ui-old/button/Button";
import { Modal } from "@/components/ui-old/modal";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

const schemma = z.object({
    titulo: z.string().min(1, { message: "Campo obrigatório" }),
})

type FormValues = z.infer<typeof schemma>;

export function FormTermo() {

    const { register, handleSubmit, formState: { errors }, setValue, reset, getValues } = useForm<FormValues>({
        resolver: zodResolver(schemma),
        defaultValues: {
            titulo: "",
        }
    });

    const [openModal, setOpenModal] = useState(false);
    const [openSheet, setOpenSheet] = useState(false);

    const { conteudoTermo, selectedTermo, setSelectedTermo, setConteudoTermo } = useTermoStore();

    const router = useRouter();

    const create = useCreateTermo();
    const update = useUpdateTermo();

    const queryClient = useQueryClient();

    function onSubmit(data: FormValues) {

        const newData = {
            titulo: data.titulo,
            conteudo: conteudoTermo,
        }

        if (selectedTermo) {
            update.mutate({
                id: selectedTermo.id,
                titulo: data.titulo,
                conteudo: conteudoTermo,
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["termos"],
                        exact: false,
                    })
                    toast.success("Termo atualizado com sucesso");
                    setSelectedTermo(null);
                    router.push("/term");
                },
                onError: (error) => {
                    toast.error("Erro ao atualizar termo");
                    console.log(error);
                }
            });
        } else {
            create.mutate(newData, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["termos"],
                        exact: false,
                    })
                    toast.success("Termo criado com sucesso");
                    router.push("/term");
                },
                onError: (error) => {
                    toast.error("Erro ao criar termo");
                    console.log(error);
                }
            });
        }

    }

    function openullscreenModal() {
        setOpenModal(true);
    }

    function closeFullscreenModal() {
        setOpenModal(false);
    }

    useEffect(() => {
        if (selectedTermo) {
            setValue("titulo", selectedTermo.titulo);
            setConteudoTermo(selectedTermo.conteudo);
        } else {
            reset();
        }
    }, [selectedTermo, setValue, reset]);


    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] ">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="mt-4 mx-2 p-2 flex gap-2 justify-between items-center">
                    <Link href={'/term'} className="text-blue-600 cursor-pointer flex items-center ga-2">
                        <ChevronLeft size={18} />
                        <span>Voltar</span>
                    </Link>
                    <div className="flex gap-2">
                        <Button onClick={openullscreenModal} size="sm" variant="outline" type="button">Preview</Button>
                        <Button onClick={() => setOpenSheet(true)} size="sm" type="button" className="bg-orange-900 hover:bg-orange-800 text-white">Variáveis</Button>
                        <Button size="sm" type="submit">Salvar</Button>
                    </div>
                </div>

                <div className="mx-2 p-2">
                    <Label>Título</Label>
                    <Input
                        name="titulo"
                        register={register}
                        error={errors.titulo ? true : false}
                    />
                    {errors.titulo && (
                        <p className="mt-1.5 text-xs text-error-500">
                            {errors.titulo.message}
                        </p>
                    )}
                </div>

                <EditorConteudo />

            </form>

            <Modal
                isOpen={openModal}
                onClose={closeFullscreenModal}
                isFullscreen={true}
                showCloseButton={true}
            >
                <div className="fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 lg:p-10">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                            {getValues('titulo') || 'Sem titulo'}
                        </h4>

                        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-900 border w-[794px] h-[1123px] rounded mx-auto">
                            <div dangerouslySetInnerHTML={{ __html: conteudoTermo }} />
                        </div>

                    </div>
                    <div className="flex items-center justify-end w-full gap-3 mt-8">
                        <Button size="sm" variant="outline" onClick={closeFullscreenModal}>
                            Fechar
                        </Button>
                    </div>
                </div>
            </Modal>

            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetContent className="w-full z-999 dark:bg-gray-900 overflow-y-auto custom-scrollbar">
                    <SheetHeader>
                        <SheetTitle className="mb-4 pb-2 border-b">Variáveis - (Palavras chaves)</SheetTitle>
                        <SheetDescription asChild >
                            <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
                                <table className="w-full border-collapse text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                                                Placeholder
                                            </th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200">
                                                Descrição
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        <tr>
                                            <td className="px-4 py-2 font-mono text-blue-600">#nome_cliente</td>
                                            <td className="px-4 py-2">Nome do Cliente</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-mono text-blue-600">#telefone_cliente</td>
                                            <td className="px-4 py-2">Número de telefone do Cliente</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-mono text-blue-600">#num_bi</td>
                                            <td className="px-4 py-2">Número de BI do Cliente</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-mono text-blue-600">#valor_total</td>
                                            <td className="px-4 py-2">Valor total pago pelo Cliente</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-mono text-blue-600">#servicos</td>
                                            <td className="px-4 py-2">Todos os serviços a serem prestados ao Cliente</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-mono text-blue-600">#num_membros</td>
                                            <td className="px-4 py-2">Número de membros (subcontas) do Cliente</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-mono text-blue-600">#assinatura_agencia</td>
                                            <td className="px-4 py-2">Assinatura da Agência (usuário)</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-mono text-blue-600">#assinatura_cliente</td>
                                            <td className="px-4 py-2">Assinatura do Cliente</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

        </div>
    )
}