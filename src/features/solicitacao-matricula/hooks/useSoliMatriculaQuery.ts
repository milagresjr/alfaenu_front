import { useMutation } from "@tanstack/react-query";
import { createSolicitacaoMatricula } from "../api/soliMatriculaApi";



export const useCreateSolicitacaoMatricula = () => {
    const mutation = useMutation({
        mutationFn: (newSolicitacao: FormData) => createSolicitacaoMatricula(newSolicitacao),
    });

    return mutation;
};