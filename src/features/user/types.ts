
export type UserType = {
    id?: number | string;
    nome: string;
    email: string;
    password: string;
    status?: boolean;
    type?: string;
    password_confirmation?: string;
}

export type PaginatedUser = {
    data: UserType[];
    total: number;
    page: number;
    per_page: number;
}