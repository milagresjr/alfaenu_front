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
import { useQueryClient } from "@tanstack/react-query";
import { useProgress } from "@bprogress/next";
import { useCreateMovFinanceira, useUpdateMovFinanceira } from "@/features/movimentacoes-financeiras/hooks/movFinanceirasQuery";
import { useMovFinanceiraStore } from "@/features/movimentacoes-financeiras/store/useMovFinanceirasStore";
import { useCounts } from "@/features/count/hooks/useCountQuery";
import { useAuthStore } from "@/store/useAuthStore";

// ✅ Schema de validação
const schema = z.object({
    conta_financeira_id: z.string().min(1, { message: "Campo obrigatório" }),
    tipo: z.string(),
    valor: z
        .string()
        .refine((val) => !isNaN(parseFloat(val)), { message: "Valor inválido" }),
    origem: z.string().min(1, { message: "Campo obrigatório" }),
    descricao: z.string(),
    caixa_movimentacao_id: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function FormMovFinanceira() {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            conta_financeira_id: "",
            tipo: "entrada",
            valor: "",
            origem: "",
            descricao: "",
            caixa_movimentacao_id: "",
        },
    });

    // 🧠 Store e hooks
    const { selectedMovFinanceira, setSelectedMovFinanceira } = useMovFinanceiraStore();

    const route = useRouter();
    const progress = useProgress();

    const { user } = useAuthStore();

    const queryClient = useQueryClient();
    const create = useCreateMovFinanceira();
    const update = useUpdateMovFinanceira();

    const { data: dataContas } = useCounts();

    const mode = selectedMovFinanceira ? "edit" : "create";

    const onSubmit = (data: FormValues) => {
        const payload = {
            ...data,
            utilizador_id: String(user?.id),
            valor: parseFloat(data.valor),
        };

        if (selectedMovFinanceira) {
            update.mutate(
                { id: selectedMovFinanceira.id, ...payload },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["mov-financeiras"], exact: false });
                        toast.success("Transação atualizada com sucesso!");
                        setSelectedMovFinanceira(null);
                        route.push("/operation/mov-financeiras");
                    },
                    onError: (error: any) => {
                        if (error.response?.status === 422) {
                            const errors = error.response.data.errors;
                            const firstError = (Object.values(errors) as string[][])[0][0];
                            toast.error(firstError);
                        } else {
                            toast.error("Erro ao atualizar movimentação");
                        }
                    },
                }
            );
        } else {
            create.mutate(payload, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["mov-financeiras"], exact: false });
                    toast.success("Transação criada com sucesso!");
                    route.push("/operation/mov-financeiras");
                },
                onError: (error: any) => {
                    if (error.response?.status === 422) {
                        const errors = error.response.data.errors;
                        const firstError = (Object.values(errors) as string[][])[0][0];
                        toast.error(firstError);
                    } else {
                        toast.error("Erro ao criar movimentação");
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
        if (selectedMovFinanceira) {
            setValue("conta_financeira_id", String(selectedMovFinanceira.conta_financeira_id) || '');
            setValue("tipo", selectedMovFinanceira.tipo);
            setValue("valor", selectedMovFinanceira.valor.toString());
            setValue("origem", selectedMovFinanceira.origem);
            setValue("descricao", selectedMovFinanceira.descricao?.toString() || '');
            if (selectedMovFinanceira.caixa_movimentacao_id)
                setValue("caixa_movimentacao_id", selectedMovFinanceira.caixa_movimentacao_id.toString());
        } else {
            reset();
        }
    }, [selectedMovFinanceira, setValue, reset]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <h1 className="text-lg my-3 text-gray-700 dark:text-gray-300">
                        {mode === "create" ? "Criar Transação" : "Editar Transação"}
                    </h1>

                    <div className="flex items-center gap-2">
                        <Button type="button" onClick={handleBack} size="sm" variant="outline">
                            Voltar
                        </Button>
                        <Button
                            size="sm"
                            variant="primary"
                            disabled={create.isPending || update.isPending}
                            >
                            {(create.isPending || update.isPending)
                                ? "Salvando..."
                                : "Salvar"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">

                    <div className="col-span-2 md:col-span-3">
                        <Label>Conta Financeira</Label>
                        <select
                            id="conta_financeira_id"
                            {...register("conta_financeira_id")}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 ${errors.conta_financeira_id ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="" disabled>
                                Selecione uma conta
                            </option>
                            {dataContas?.data?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nome}
                                </option>
                            ))}
                        </select>
                        {errors.conta_financeira_id && (
                            <p className="mt-1.5 text-xs text-error-500">
                                {errors.conta_financeira_id.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2 md:col-span-3">
                        <Label>Tipo</Label>
                        <select
                            id="tipo"
                            {...register("tipo")}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 ${errors.tipo ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="entrada">Receita</option>
                            <option value="saida">Despesa</option>
                        </select>
                        {errors.tipo && (
                            <p className="mt-1.5 text-xs text-error-500">{errors.tipo.message}</p>
                        )}
                    </div>

                    <div className="col-span-2 md:col-span-3">
                        <Label>Valor (Kz)</Label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            name="valor"
                            register={register}
                            error={!!errors.valor}
                        />
                        {errors.valor && (
                            <p className="mt-1.5 text-xs text-error-500">{errors.valor.message}</p>
                        )}
                    </div>

                    <div className="col-span-2 md:col-span-3">
                        <Label>Origem</Label>
                        <Input
                            type="text"
                            placeholder="Ex: Transferência, Depósito, Pagamento, etc."
                            name="origem"
                            register={register}
                            error={!!errors.origem}
                        />
                        {errors.origem && (
                            <p className="mt-1.5 text-xs text-error-500">{errors.origem.message}</p>
                        )}
                    </div>

                    <div className="col-span-2 md:col-span-6">
                        <Label>Descrição</Label>
                        <Input
                            type="text"
                            placeholder="Descrição detalhada"
                            name="descricao"
                            register={register}
                            error={!!errors.descricao}
                        />
                        {errors.descricao && (
                            <p className="mt-1.5 text-xs text-error-500">{errors.descricao.message}</p>
                        )}
                    </div>

                </div>
            </form>
        </div>
    );
}
