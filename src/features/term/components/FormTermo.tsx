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
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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

                <div className="mt-4 mx-2 p-2">
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

                <div className=" mx-4 p-2 flex justify-end">
                    <button type="submit" className="bg-orange-600 text-white px-3 py-2 rounded-sm">Salvar</button>
                </div>
            </form>
        </div>
    )
}