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
import { useQueryClient } from "@tanstack/react-query";
import { useProgress } from "@bprogress/next";
import { useCreateCount, useUpdateCount } from "../hooks/useCountQuery";
import { useCountStore } from "../store/useCountStore";

// 🧾 Schema de validação com zod
const schema = z.object({
    nome: z.string().min(1, { message: "Campo obrigatório" }),
    iban: z.string().min(1, { message: "Campo obrigatório" }),
    // tipo: z.string().min(1, { message: "Campo obrigatório" }),
    numero_conta: z.string().min(1, { message: "Campo obrigatório" }),
    saldo_atual: z
        .string()
        .refine((val) => !isNaN(parseFloat(val)), { message: "Saldo inválido" }),
});

type FormValues = z.infer<typeof schema>;

export function FormCount() {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: "",
            iban: "",
            numero_conta: "",
            saldo_atual: "",
        },
    });

    // 🔄 Stores e hooks (mantém a mesma estrutura que o FormClient)
    const { selectedCount, setSelectedCount } = useCountStore();

    const route = useRouter();
    const create = useCreateCount();
    const update = useUpdateCount();
    const progress = useProgress();
    const queryClient = useQueryClient();

    const mode = selectedCount ? "edit" : "create";

    const onSubmit = (data: FormValues) => {
        const payload = {
            ...data,
            tipo: "banco",
            saldo: parseFloat(data.saldo_atual),
        };

        if (selectedCount) {
            update.mutate(
                { id: selectedCount.id, ...payload },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["contas"], exact: false });
                        toast.success("Conta atualizada com sucesso!");
                        setSelectedCount(null);
                        route.push("/operation/count");
                    },
                    onError: (error: any) => {
                        if (error.response?.status === 422) {
                            const errors = error.response.data.errors;
                            const firstError = (Object.values(errors) as string[][])[0][0];
                            toast.error(firstError);
                        } else {
                            toast.error("Erro ao atualizar conta");
                        }
                    },
                }
            );
        } else {
            create.mutate(payload, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["contas"], exact: false });
                    toast.success("Conta criada com sucesso!");
                    route.push("/operation/count");
                },
                onError: (error: any) => {
                    if (error.response?.status === 422) {
                        const errors = error.response.data.errors;
                        const firstError = (Object.values(errors) as string[][])[0][0];
                        toast.error(firstError);
                    } else {
                        toast.error("Erro ao criar conta");
                    }
                },
            });
        }
    };

    function handleBack() {
        progress.start();
        route.back();
    }

    useEffect(() => {
        if (selectedCount) {
            setValue("nome", selectedCount.nome);
            setValue("iban", selectedCount.iban);
            // setValue("tipo", selectedCount.tipo);
            setValue("numero_conta", selectedCount.numero_conta);
            setValue("saldo_atual", selectedCount.saldo_atual.toString());
        } else {
            reset();
        }
    }, [selectedCount, setValue, reset]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <h1 className="text-lg my-3 text-gray-700 dark:text-gray-300">
                        {mode === "create" ? "Criar Conta" : "Editar Conta"}
                    </h1>

                    <div className="flex items-center gap-2">
                        <Button onClick={handleBack} size="sm" variant="outline">
                            Voltar
                        </Button>
                        <Button size="sm" variant="primary" disabled={create.isPending || update.isPending}>
                            {(create.isPending || update.isPending) ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">
                    <div className="col-span-2 md:col-span-3">
                        <Label>Banco</Label>
                        <select
                            id="nome"
                            {...register("nome")}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 ${errors.nome ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">Selecione...</option>
                            <option value="BAI">Banco Angolano de Investimento</option>
                            <option value="BIC">Banco BIC</option>
                            <option value="YETU">Banco Yetu</option>
                            <option value="SOL">Banco Sol</option>
                            <option value="BNI">Banco de Negócios Internacional</option>
                            <option value="BDA">Banco de Desenvolvimento de Angola</option>
                            <option value="BCA">Banco Comercial Angolano, S.A</option>
                            <option value="BCH">Banco Comercial do Huambo</option>
                            <option value="BFA">Banco de Fomento Angola</option>
                            <option value="BPC">Banco de Poupança e Crédito</option>
                            <option value="BE">Banco Económico</option>
                            <option value="BRK">Banco Regional do Keve</option>
                            <option value="BIR">Banco de Investimento Rural</option>
                            <option value="BMA">Banco Millennium Atlântico</option>
                            <option value="BCS">Banco de Crédito do Sul, S.A.</option>
                            <option value="VTB">Banco VTB África S.A.</option>
                            <option value="FNB">Finibanco Angola, S.A</option>
                            <option value="SBA">Standard Bank Angola</option>
                            <option value="BCGA">Banco Caixa Geral Angola</option>
                            <option value="BOCLB">Banco da China Lda - Sucursal de Luanda</option>
                            <option value="BVB">Banco Valor S.A</option>
                            <option value="BPG">Banco Prestígio</option>
                            <option value="BMF">Banco BAI Micro Finanças S.A.</option>
                            <option value="BCI">Banco de Comércio e Indústria</option>
                        </select>
                        {errors.nome && (
                            <p className="mt-1.5 text-xs text-error-500">{errors.nome.message}</p>
                        )}
                    </div>


                    <div className="col-span-2 md:col-span-3">
                        <Label>IBAN</Label>
                        <Input
                            type="text"
                            placeholder="IBAN da conta"
                            name="iban"
                            register={register}
                            error={!!errors.iban}
                        />
                        {errors.iban && <p className="mt-1.5 text-xs text-error-500">{errors.iban.message}</p>}
                    </div>

                    {/* <div className="col-span-2">
                        <Label>Tipo</Label>
                        <Input
                            type="text"
                            placeholder="Tipo"
                            name="tipo"
                            register={register}
                            error={!!errors.tipo}
                        />
                        {errors.tipo && <p className="mt-1.5 text-xs text-error-500">{errors.tipo.message}</p>}
                    </div> */}

                    <div className="col-span-2 md:col-span-3">
                        <Label>Número da Conta</Label>
                        <Input
                            type="text"
                            placeholder="Número da conta"
                            name="numero_conta"
                            register={register}
                            error={!!errors.numero_conta}
                        />
                        {errors.numero_conta && <p className="mt-1.5 text-xs text-error-500">{errors.numero_conta.message}</p>}
                    </div>

                    <div className="col-span-2 md:col-span-3">
                        <Label>Saldo (Kz)</Label>
                        <Input
                            type="number"
                            placeholder="Saldo inicial"
                            name="saldo_atual"
                            register={register}
                            error={!!errors.saldo_atual}
                        />
                        {errors.saldo_atual && <p className="mt-1.5 text-xs text-error-500">{errors.saldo_atual.message}</p>}
                    </div>

                </div>
            </form>
        </div>
    );
}
