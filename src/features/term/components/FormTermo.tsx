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

const schemma = z.object({
    titulo: z.string().min(1, { message: "Campo obrigatório" }),
})

type FormValues = z.infer<typeof schemma>;

export function FormTermo() {

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormValues>({
        resolver: zodResolver(schemma),
        defaultValues: {
            titulo: "",
        }
    });

    const [openModal, setOpenModal] = useState(false);

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
                    <Link href={'/term'} className="text-blue-600 cursor-pointer">Voltar</Link>
                    <div className="flex gap-2">
                        <Button onClick={openullscreenModal} size="sm" variant="outline" type="button">Preview</Button>
                        <Button size="sm" type="submit">Salvar</Button>
                    </div>
                </div>

                <div className="mx-2 p-2">
                    <Label>Título</Label>
                    <Input
                        name="titulo"
                        register={register}
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
                            {selectedTermo?.titulo || 'Sem titulo'}
                        </h4>

                        <div className="mt-4 p-2 bg-gray-100 rounded mx-auto h-[800px]">
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

        </div>
    )
}