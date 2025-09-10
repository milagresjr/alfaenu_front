"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useCreateCliente, useDeleteCliente, useUpdateCliente } from "../hooks/useClientsQuery";
import { useClienteStore } from "../store/useClienteStore";
import { toast } from "react-toastify";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";


const schema = z.object({
    nome: z.string().min(1, { message: "Campo obrigatório" }),
    email: z.string().email("Email inválido").or(z.literal("")),
    telefone: z
        .string()
        .refine((val) => val === "" || /^\d{9}$/.test(val), {
            message: "O telefone deve ter exatamente 9 dígitos numéricos",
        }),
    data_nascimento: z.string(),
    endereco: z.string(),
    n_bi: z.string().regex(/^\d{9}[A-Z]{2}\d{3}$/, "Número de BI inválido").or(z.literal(""))

});

type FormValues = z.infer<typeof schema>;

export function FormClient() {

    const { register, handleSubmit, setValue, reset, formState: { errors }, control } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: "",
            email: "",
            telefone: "",
            data_nascimento: "",
            endereco: "",
            n_bi: "",
        }
    });

    const { selectedCliente, setSelectedCliente } = useClienteStore();

    const route = useRouter();

    const create = useCreateCliente();
    const update = useUpdateCliente();

    const mode = selectedCliente ? "edit" : "create";

    const queryClient = useQueryClient();

    const onSubmit = (data: FormValues) => {

        if (selectedCliente) {
            update.mutate({
                id: selectedCliente.id,
                nome: data.nome,
                email: data.email,
                telefone: data.telefone,
                data_nascimento: data.data_nascimento,
                endereco: data.endereco,
                n_bi: data.n_bi,
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["clientes"],
                        exact: false,
                    });
                    toast.success("Cliente atualizado com sucesso");
                    setSelectedCliente(null);
                    route.push("/client");
                },
                onError: () => {
                    toast.error("Erro ao atualizar cliente");
                }
            });
        } else {
            create.mutate(data, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["clientes"],
                        exact: false,
                    });
                    toast.success("Cliente criado com sucesso");
                    route.push("/client");
                },
                onError: () => {
                    toast.error("Erro ao criar cliente");
                }
            });
        }
    }

    useEffect(() => {
        if (selectedCliente) {
            setValue('nome', selectedCliente.nome);
            setValue("email", selectedCliente.email);
            setValue("telefone", selectedCliente.telefone || '');
            setValue("data_nascimento", selectedCliente.data_nascimento || '');
            setValue("endereco", selectedCliente.endereco || '');
            setValue("n_bi", selectedCliente.n_bi || '');
        } else {
            reset();
        }
    }, [selectedCliente, setValue, reset]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
            <h1 className="text-lg my-3 text-gray-700 dark:text-gray-300">{mode === "create" ? "Criar Cliente" : "Editar Cliente"}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">
                    <div className="col-span-2">
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

                    <div className="col-span-2 ">
                        <Label>Email</Label>
                        <Input type="email"
                            placeholder="Descrição"
                            name="email"
                            register={register}
                            error={errors.email ? true : false}
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2 ">
                        <Label>Telefone</Label>
                        <Input type="number"
                            placeholder="Descrição"
                            name="telefone"
                            register={register}
                            error={errors.telefone ? true : false}
                        />
                        {errors.telefone && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.telefone.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2 ">
                        <Label>Nº BI</Label>
                        <Input type="text"
                            placeholder="Descrição"
                            name="n_bi"
                            register={register}
                            error={errors.n_bi ? true : false}
                        />
                        {errors.n_bi && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.n_bi.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2 ">
                        <Controller
                            name="data_nascimento"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    id="data_nascimento"
                                    label="Data de Nascimento"
                                    defaultDate={field.value}
                                    onChange={(dates) => field.onChange(dates[0].toISOString().split('T')[0])} // pega só a primeira data
                                />
                            )}
                        />
                        {errors.data_nascimento && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.data_nascimento.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2 ">
                        <Label>Endereco</Label>
                        <Input type="text"
                            placeholder="Endereco"
                            name="endereco"
                            register={register}
                        />
                        {errors.endereco && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.endereco.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end w-full gap-3 mt-8">
                    <Link href={"/client"}>
                        <Button size="sm" variant="outline">
                            Voltar
                        </Button>
                    </Link>
                    <Button size="sm" variant="primary">
                        Salvar
                    </Button>
                </div>

            </form>
        </div>
    )

}