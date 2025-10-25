import Link from "next/link";


export function OpcoesOperacoes() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Link href={"/operation/my-caixa"}>
                <div className="min-h-[100px] p-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white flex flex-col gap-1">
                    <h2 className="text-lg font-bold">Meu Caixa</h2>
                    <p className="text-sm">Abertura e fecho de caixa</p>
                </div>
            </Link>
             <Link href={"/operation/count"}>
                <div className="min-h-[100px] p-3 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white flex flex-col gap-1">
                    <h2 className="text-lg font-bold">Contas</h2>
                    <p className="text-sm">Gerencie suas contas</p>
                </div>
            </Link>
             <Link href={"/operation/mov-financeiras"}>
                <div className="min-h-[100px] p-3 rounded-md bg-purple-600 hover:bg-purple-700 text-white flex flex-col gap-1">
                    <h2 className="text-lg font-bold">Transações Financeiras</h2>
                    <p className="text-sm">Gerencie suas contas, saldos e movimentações</p>
                </div>
            </Link>
        </div>
    )
}