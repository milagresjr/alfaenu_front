"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/ui-old/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMovimentoSubcontaStore } from "../store/useMovimentoSubcontaStore";
import { useCreateMovimento, useUpdateMovimento } from "../hooks/useMovimentosQuery";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useSubcontaStore } from "@/features/subconta/store/useSubcontaStore";
import DialogMovimentoCreated from "./DialogMovimentoCreated";
import { gerarPdfMovimentoSubconta } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const schema = z.object({
    valor: z.string().min(1, "O valor é obrigatório"),
    tipo: z.enum(["entrada", "saida"]),
    descricao: z.string().optional(),
});


type FormValues = z.infer<typeof schema>;

export function FormMovimentoSubconta() {

    const { register, handleSubmit, setValue, reset, formState: { errors }, control, watch } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            valor: "",
            tipo: "entrada",
            descricao: ""
        }
    });

    const route = useRouter();

    const { user } = useAuthStore();

    const { idSubconta } = useParams();

    const { selectedMovimentoSubconta, setSelectedMovimentoSubconta } = useMovimentoSubcontaStore();

    const { openDialogFormMovimentoSubconta, setOpenDialogFormMovimentoSubconta } = useMovimentoSubcontaStore();

    const { selectedSubconta } = useSubcontaStore();

    const [openDialogCreated, setOpenDialogCreated] = useState(false);

    const [idMovimentoCreated, setIdMovimentoCreated] = useState<number | null>(null);

    const create = useCreateMovimento();
    const update = useUpdateMovimento();

    // const mode = selectedMovimentoSubconta ? "edit" : "create";

    const opcoesTipo = [
        { value: 'entrada', label: 'Entrada' },
        { value: 'saida', label: 'Saida' }
    ];

    function handleCloseDialog() {
        setOpenDialogFormMovimentoSubconta(false);
        setSelectedMovimentoSubconta(null);
        reset();
    }

    const queryClient = useQueryClient();

    function onSubmit(data: FormValues) {

        const allData = {
            utilizador_id: user?.id,
            valor: Number(data.valor),
            tipo: data.tipo,
            descricao: data.descricao,
            subconta_id: idSubconta ? Number(idSubconta) : Number(selectedSubconta?.id) // Replace with actual subconta_id
        }

        if (selectedMovimentoSubconta) {
            update.mutate({
                id: selectedMovimentoSubconta.id,
                valor: allData.valor,
                tipo: allData.tipo,
                descricao: allData.descricao,
                subconta_id: selectedMovimentoSubconta.subconta_id
            }, {
                onSuccess: () => {
                    toast.success("Movimento atualizado com sucesso!");
                    handleCloseDialog();
                    queryClient.invalidateQueries({
                        queryKey: ["movimentos-subconta"],
                        exact: false
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["subcontas"],
                        exact: false
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['caixaAberto'],
                        exact: false
                    });
                },
                onError: (error: any) => {
                    toast.error("Erro ao atualizar movimento: " + error.message);
                }
            });
        } else {
            create.mutate(allData, {
                onSuccess: (response: any) => {
                    toast.success("Movimento criado com sucesso!");
                    handleCloseDialog();
                    queryClient.invalidateQueries({
                        queryKey: ["movimentos-subconta"],
                        exact: false
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["subcontas"],
                        exact: false
                    });
                    const documentoId = response?.data?.id;
                    setIdMovimentoCreated(documentoId || null);
                    setOpenDialogCreated(true);
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message);
                    console.error("Erro ao criar movimento:", error);
                }
            });
        }
    }

    useEffect(() => {
        if (selectedMovimentoSubconta) {
            setValue("valor", String(selectedMovimentoSubconta.valor));
            setValue("tipo", selectedMovimentoSubconta.tipo);
            setValue("descricao", selectedMovimentoSubconta.descricao || "");
        } else {
            reset();
        }
    }, [selectedMovimentoSubconta, setValue, reset]);

    return (
        <>
            <Dialog open={openDialogFormMovimentoSubconta} onOpenChange={setOpenDialogFormMovimentoSubconta}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Movimento</DialogTitle>
                        <DialogDescription asChild>
                            <form onSubmit={handleSubmit(onSubmit)}>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-6">

                                    <div className="col-span-6">
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


                                    <div className="col-span-6">
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


                                    <div className="col-span-6">
                                        <Label>Descrição</Label>
                                        <TextArea
                                            name="descricao"
                                            placeholder="Descrição (opcional)"
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

                                <div className="flex items-center justify-end gap-2 mt-3">
                                    <Button size="sm" variant="primary" disabled={(create.isPending || update.isPending)}>
                                        {(create.isPending || update.isPending) ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                </div>

                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <DialogMovimentoCreated
                open={openDialogCreated}
                onOpenChange={setOpenDialogCreated}
                idMovimento={idMovimentoCreated!}
                onPrintContract={() => {
                    if (idMovimentoCreated) {
                        gerarPdfMovimentoSubconta(idMovimentoCreated);
                    } else {
                        toast.error("ID do contrato não disponível.");
                    }
                }}
            />
        </>
    );
}