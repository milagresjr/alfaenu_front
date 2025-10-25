

// export type CountType = {
//     id?: string | number;
//     banco: string;
//     iban: string;
//     titular: string;
//     numero_conta: string;
//     saldo: number;
//     gestor_conta: string;
//     telefone: string;
//     email: string;
//     endereco: string;
//     estado?: string;
// };

export type CountType = {
    id?: string | number;
    nome: string;
    iban: string;
    tipo: string;
    numero_conta: string;
    saldo_atual: number | string;
    estado?: string;
};