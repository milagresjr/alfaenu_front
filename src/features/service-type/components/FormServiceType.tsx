"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/ui-old/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useServiceTypeStore } from "../store/useServiceTypeStore";
import { useCreateTipoServico, useUpdateTipoServico } from "../hooks/useServiceTypeQuery";
import { useProgress } from "@bprogress/next";


const schema = z.object({
    descricao: z.string().min(1, { message: "Campo obrigatório" }),
});

type FormValues = z.infer<typeof schema>;

export function FormServiceType() {

    const { register, handleSubmit, setValue, reset, formState: { errors }, control, watch } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            descricao: ""
        }
    });

    const { selectedServiceType, setSelectedServiceType } = useServiceTypeStore();

    const route = useRouter();

    const progress = useProgress();

    const create = useCreateTipoServico();
    const update = useUpdateTipoServico();

    const mode = selectedServiceType ? "edit" : "create";

    const queryClient = useQueryClient();

    const onSubmit = (data: FormValues) => {

        if (selectedServiceType) {
            update.mutate({
                id: selectedServiceType.id,
                descricao: data.descricao,
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["tipo-servicos"],
                        exact: false,
                    });
                    toast.success("Tipo de Serviço atualizado com sucesso");
                    setSelectedServiceType(null);
                    progress.start();
                    route.push("/service-type");
                },
                onError: () => {
                    toast.error("Erro ao atualizar Tipo Serviço");
                }
            });
        } else {
            create.mutate(data, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["tipo-servicos"],
                        exact: false,
                    });
                    toast.success("Tipo de Serviço criado com sucesso");
                    route.push("/service-type");
                },
                onError: () => {
                    toast.error("Erro ao criar Serviço");
                }
            });
        }
    }

    useEffect(() => {
        if (selectedServiceType) {
            setValue('descricao', selectedServiceType.descricao);
        } else {
            reset();
        }
    }, [selectedServiceType, setValue, reset]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="flex justify-between items-center">
                    <h1 className="text-lg my-3 text-gray-700 dark:text-gray-300">{mode === "create" ? "Criar Categoria de Serviço" : "Editar Categoria de Serviço"}</h1>
                    <div className="flex items-center gap-2">
                        <Link href={"/client"}>
                            <Button size="sm" variant="outline">
                                Voltar
                            </Button>
                        </Link>
                        <Button size="sm" variant="primary" disabled={(create.isPending || update.isPending)}>
                            {(create.isPending || update.isPending) ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">
                    <div className="col-span-6">
                        <Label>Nome</Label>
                        <Input type="text"
                            placeholder="Nome"
                            name="descricao"
                            register={register}
                            error={errors.descricao ? true : false}
                        />
                        {errors.descricao && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.descricao.message}
                            </p>
                        )}
                    </div>

                </div>

            </form>
        </div>
    )

}