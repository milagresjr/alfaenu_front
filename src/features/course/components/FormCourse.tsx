"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCourseStore } from "../store/useCourseStore";
import { toast } from "react-toastify";
import Button from "@/components/ui-old/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useProgress } from "@bprogress/next";
import { useCreateCourse, useUpdateCourse } from "../hooks/useCourseQuery";

const schema = z.object({
    nome: z.string().min(1, { message: "Campo obrigatório" }),
    local: z.string().min(1, { message: "Campo obrigatório" }),
});

type FormValues = z.infer<typeof schema>;

export function FormCourse() {
    const { register, handleSubmit, setValue, reset, formState: { errors }, control } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: "",
            local: "",
        }
    });

    const { selectedCourse, setSelectedCourse } = useCourseStore();
    const route = useRouter();
    const create = useCreateCourse();
    const update = useUpdateCourse();
    const progress = useProgress();
    const router = useRouter();
    const mode = selectedCourse ? "edit" : "create";
    const queryClient = useQueryClient();

    const onSubmit = (data: FormValues) => {
        if (selectedCourse) {
            update.mutate({
                id: selectedCourse.id,
                ...data,
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["courses"],
                        exact: false,
                    });
                    toast.success("Curso atualizado com sucesso");
                    setSelectedCourse(null);
                    route.push("/course");
                },
                onError: (error: any) => {
                    if (error.response?.status === 422) {
                        const errors = error.response.data.errors;
                        const firstError = (Object.values(errors) as string[][])[0][0];
                        toast.error(firstError);
                    } else {
                        toast.error("Erro ao atualizar curso");
                    }
                }
            });
        } else {
            create.mutate(data, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["courses"],
                        exact: false,
                    });
                    toast.success("Curso criado com sucesso");
                    route.push("/course");
                },
                onError: (error: any) => {
                    if (error.response?.status === 422) {
                        const errors = error.response.data.errors;
                        const firstError = (Object.values(errors) as string[][])[0][0];
                        toast.error(firstError);
                    } else {
                        toast.error("Erro ao criar curso");
                    }
                }
            });
        }
    }

    function handleBack() {
        progress.start();
        router.back();
    }

    useEffect(() => {
        if (selectedCourse) {
            setValue('nome', selectedCourse.nome);
            setValue('local', selectedCourse.local);
        } else {
            reset();
        }
    }, [selectedCourse, setValue, reset]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <h1 className="text-lg my-3 text-gray-700 dark:text-gray-300">
                        {mode === "create" ? "Criar Curso" : "Editar Curso"}
                    </h1>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleBack} size="sm" variant="outline">
                            Voltar
                        </Button>
                        <Button size="sm" variant="primary" disabled={(create.isPending || update.isPending)}>
                            {(create.isPending || update.isPending) ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">
                    <div className="col-span-3">
                        <Label>Nome</Label>
                        <Input type="text" placeholder="Nome do curso" name="nome" register={register} error={!!errors.nome} />
                        {errors.nome && <p className="mt-1.5 text-xs text-error-500">{errors.nome.message}</p>}
                    </div>

                    <div className="col-span-3">
                        <Label>Local</Label>
                        <Input type="text" placeholder="Local" name="local" register={register} error={!!errors.local} />
                        {errors.local && <p className="mt-1.5 text-xs text-error-500">{errors.local.message}</p>}
                    </div>
                </div>
            </form>
        </div>
    )
}
