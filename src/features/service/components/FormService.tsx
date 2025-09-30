"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/ui-old/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useServiceStore } from "../store/useServiceStore";
import { useCreateServico, useUpdateServico } from "../hooks/useServicesQuery";
import Select from "@/components/form/Select";
import { useTipoServicos } from "@/features/service-type/hooks/useServiceTypeQuery";


const schema = z.object({
    nome: z.string().min(1, { message: "Campo obrigatório" }),
    tipo: z.string(),
    categoria_id: z.string(),
    valor: z.string().min(1, { message: "Campo obrigatório" }),
    valor_externo: z.string(),
}).superRefine((data, ctx) => {
    if (data.tipo === "externo" && !data.valor_externo) {
        ctx.addIssue({
            path: ["valor_externo"],
            code: "custom",
            message: "O valor externo é obrigatório quando o tipo for 'externo'",
        });
    }
});

type FormValues = z.infer<typeof schema>;

export function FormService() {

    const { register, handleSubmit, setValue, reset, formState: { errors }, control, watch } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: "",
            categoria_id: "",
            tipo: "interno",
            valor: "",
            valor_externo: ""
        }
    });

    const { selectedService, setSelectedService } = useServiceStore();

    const route = useRouter();

    const create = useCreateServico();
    const update = useUpdateServico();

    const mode = selectedService ? "edit" : "create";

    const { data: dataTipoServicos } = useTipoServicos({estado: "ativo"});

    const tipoServico = watch("tipo");

    const queryClient = useQueryClient();

    const opcoesTipo = [
        { value: 'interno', label: 'Interno' },
        { value: 'externo', label: 'Externo' }
    ];

    const opcoesCategoria = dataTipoServicos?.data.map((tipoService) => ({
        value: String(tipoService.id),
        label: tipoService.descricao
    }))

    const onSubmit = (data: FormValues) => {

        if (selectedService) {
            update.mutate({
                id: selectedService.id,
                nome: data.nome,
                categoria_id: data.categoria_id,
                tipo: data.tipo,
                valor: data.valor,
                valor_externo: data.valor_externo == 'null' ? '0' : data.valor_externo,
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["servicos"],
                        exact: false,
                    });
                    toast.success("Serviço atualizado com sucesso");
                    setSelectedService(null);
                    route.push("/service");
                },
                onError: () => {
                    toast.error("Erro ao atualizar Serviço");
                }
            });
        } else {
            create.mutate(data, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["servicos"],
                        exact: false,
                    });
                    toast.success("Serviço criado com sucesso");
                    route.push("/service");
                },
                onError: () => {
                    toast.error("Erro ao criar Serviço");
                }
            });
        }
    }

    useEffect(() => {
        if (selectedService) {
            setValue('nome', selectedService.nome);
            setValue('categoria_id', String(selectedService?.categoria_id));
            setValue("tipo", selectedService.tipo);
            setValue("valor", String(selectedService.valor));
            setValue("valor_externo", String(selectedService?.valor_externo));
        } else {
            reset();
        }
    }, [selectedService, setValue, reset]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="flex justify-between items-center">
                    <h1 className="text-lg my-3 text-gray-700 dark:text-gray-300">{mode === "create" ? "Criar Serviço" : "Editar Serviço"}</h1>

                    <div className="flex items-center gap-2">
                        <Link href={"/service"}>
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
                    <div className="col-span-6 md:col-span-3">
                        <Label>Nome</Label>
                        <Input type="text"
                            placeholder="Nome"
                            name="nome"
                            register={register}
                            error={errors.nome ? true : false}
                        />
                        {errors.nome && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.nome.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-6 md:col-span-3 ">
                        <Label>Categoria</Label>
                        <Controller
                            name="categoria_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={opcoesCategoria || []}
                                    value={String(field.value)}
                                    onChange={field.onChange}
                                    name={field.name}
                                />
                            )}
                        />
                        {errors.categoria_id && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.categoria_id.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-6 md:col-span-3 ">
                        <Label>Tipo</Label>
                        <Controller
                            name="tipo"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={opcoesTipo || []}
                                    value={String(field.value)}
                                    onChange={field.onChange}
                                    name={field.name}
                                />
                            )}
                        />
                        {errors.tipo && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.tipo.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-6 md:col-span-3 ">
                        <Label>Valor</Label>
                        <Input type="number"
                            placeholder="Valor interno do serviço"
                            name="valor"
                            register={register}
                            error={errors.valor ? true : false}
                        />
                        {errors.valor && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.valor.message}
                            </p>
                        )}
                    </div>

                    {
                        tipoServico === "externo" && (
                            <div className="col-span-6 md:col-span-3 ">
                                <Label>Valor externo</Label>
                                <Input type="number"
                                    placeholder="Valor externo do serviço"
                                    name="valor_externo"
                                    register={register}
                                    error={errors.valor_externo ? true : false}
                                />
                                {errors.valor_externo && (
                                    <p className="mt-1.5 text-xs text-error-500">
                                        {errors.valor_externo.message}
                                    </p>
                                )}
                            </div>
                        )
                    }

                </div>

            </form>
        </div>
    )

}