"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { useCourseStore } from "../store/useCourseStore";
import { toast } from "react-toastify";
import Button from "@/components/ui-old/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useProgress } from "@bprogress/next";
import { useCreateCourse, useUpdateCourse } from "../hooks/useCourseQuery";
import TextArea from "@/components/form/input/TextArea";
import { CourseType } from "../types";
import { useCentrosFormacao } from "@/features/centroFormacao/hooks/useCentroFormacaoQuery";

const schema = z.object({
    nome: z.string().min(1, { message: "Campo obrigatório" }),
    local: z.string().min(1, { message: "Campo obrigatório" }),
    preco: z.coerce.string(),
    duracao: z.string().min(1, { message: "Campo obrigatório" }),
    descricao: z.string(),
    centro_id: z.string().min(1, "Selecione um centro de formação"),
});

type FormValues = z.infer<typeof schema>;

export function FormCourse() {
    const { register, handleSubmit, setValue, reset, formState: { errors }, control } = useForm<FormValues>({
        resolver: zodResolver(schema) as Resolver<FormValues>,
        defaultValues: {
            nome: "",
            local: "",
            preco: "0",
            duracao: "",
            descricao: "",
            centro_id: "",
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

    const searchParams = useSearchParams();
    const centroIdParam = searchParams.get("centro_id");

    const redirectUrl = centroIdParam ? `/course?centro_id=${centroIdParam}` : "/course";

    const { data: centrosData } = useCentrosFormacao(1, 999, "");
    
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

 const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    
    // Adiciona os campos do formulário - Use EXATAMENTE os mesmos nomes do Postman
    formData.append('nome', data.nome);
    formData.append('local', data.local);
    formData.append('preco', data.preco.toString()); // Garanta que é string
    formData.append('duracao', data.duracao);
    
    // Se descricao pode ser vazia, ainda assim enviar
    formData.append('descricao', data.descricao || '');
    formData.append('centro_id', data.centro_id);
    
    // Adiciona a imagem se existir - use o mesmo nome do campo do Postman
    if (imageFile) {
        formData.append('imagem', imageFile); // Verifique se o nome do campo é 'imagem' mesmo
    }
    
    // Se for criação
    if (!selectedCourse) {
        create.mutate(formData, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["courses"],
                    exact: false,
                });
                toast.success("Curso criado com sucesso");
                setImagePreview(null);
                setImageFile(null);
                route.push(redirectUrl);
            },
            onError: (error: any) => {
                console.error('Erro completo:', error);
                console.error('Response data:', error.response?.data);
                if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;
                    const firstError = Object.values(errors)[0];
                    toast.error(String(firstError));
                } else if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Erro ao criar curso");
                }
            }
        });
    } else {
        // Se for edição, precisa do ID
        formData.append('id', String(selectedCourse.id)); // Adicione o ID ao FormData  
        update.mutate(formData, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["courses"],
                    exact: false,
                });
                toast.success("Curso atualizado com sucesso");
                setImagePreview(null);
                setImageFile(null);
                setSelectedCourse(null);
                route.push("/course");
            },
            onError: (error: any) => {
                console.error('Erro completo:', error);
                console.error('Response data:', error.response?.data);
                if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;
                    const firstError = Object.values(errors)[0];
                    toast.error(String(firstError));
                } else if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Erro ao atualizar curso");
                }
            }
        });
    }
};

    function handleBack() {
        progress.start();
        router.back();
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (selectedCourse) {
            console.log('Carregando curso para edição:', selectedCourse);
            setValue('nome', selectedCourse.nome);
            setValue('local', selectedCourse.local);
            setValue('preco', String(selectedCourse.preco));
            setValue('duracao', selectedCourse.duracao);
            setValue('descricao', selectedCourse.descricao);
            setValue('centro_id', String(selectedCourse.centro_id ?? ''));
            // Se houver imagem no curso, carregue aqui
            if (selectedCourse.imagem) {
                if (typeof selectedCourse.imagem === 'string') {
                    setImagePreview(selectedCourse.imagem);
                } else {
                    // imagem pode ser um File/Blob, então criamos uma URL para preview
                    setImagePreview(URL.createObjectURL(selectedCourse.imagem));
                    setImageFile(selectedCourse.imagem);
                }
            }
        } else {
            reset();
            // Se veio da listagem com centro_id, pré-seleciona
            if (centroIdParam) {
                setValue('centro_id', centroIdParam);
            }
            setImagePreview(null);
            setImageFile(null);
        }
    }, [selectedCourse, setValue, reset, centroIdParam]);

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
                    <div className="col-span-6 md:col-span-3">
                        <Label>Nome</Label>
                        <Input type="text" placeholder="Nome do curso" name="nome" register={register} error={!!errors.nome} />
                        {errors.nome && <p className="mt-1.5 text-xs text-error-500">{errors.nome.message}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                        <Label>Local</Label>
                        <Input type="text" placeholder="Local" name="local" register={register} error={!!errors.local} />
                        {errors.local && <p className="mt-1.5 text-xs text-error-500">{errors.local.message}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                        <Label>Centro de Formação <span className="text-error-500">*</span></Label>
                        <select
                            {...register("centro_id")}
                            className="h-11 w-full rounded-lg border border-gray-300 dark:border-white/10 bg-gray-900 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/20 focus:outline-hidden appearance-none"
                        >
                            <option value="">Selecione um centro</option>
                            {centrosData?.data?.map((centro) => (
                                <option key={centro.id} value={centro.id}>
                                    {centro.nome}
                                </option>
                            ))}
                        </select>
                        {errors.centro_id && (
                            <p className="mt-1.5 text-xs text-error-500">{errors.centro_id.message}</p>
                        )}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                        <Label>Preço</Label>
                        <Input type="text" placeholder="Preço" name="preco" register={register} error={!!errors.preco} />
                        {errors.preco && <p className="mt-1.5 text-xs text-error-500">{errors.preco.message}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                        <Label>Duração</Label>
                        <Input type="text" placeholder="Duração" name="duracao" register={register} error={!!errors.duracao} />
                        {errors.duracao && <p className="mt-1.5 text-xs text-error-500">{errors.duracao.message}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                        <Label>Descrição</Label>
                        <TextArea placeholder="Descrição do curso" name="descricao" register={register} error={!!errors.descricao} />
                        {errors.descricao && <p className="mt-1.5 text-xs text-error-500">{errors.descricao.message}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                        <Label>Imagem do Curso</Label>
                        <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
                            {imagePreview ? (
                                <div className="relative w-full h-full">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, JPEG (MAX. 5MB)
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                </div>
            </form>
        </div>
    )
}