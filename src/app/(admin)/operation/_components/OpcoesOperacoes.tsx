import Link from "next/link";


export function OpcoesOperacoes() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4">
            <Link href={"/operation/my-caixa"}>
                <div className="p-5 rounded-md bg-blue-600 hover:bg-blue-700 text-white flex flex-col gap-1">
                    <h2 className="text-lg">Meu Caixa</h2>
                    <p className="text-sm">Abertura e fecho de caixa</p>
                </div>
            </Link>
        </div>
    )
}