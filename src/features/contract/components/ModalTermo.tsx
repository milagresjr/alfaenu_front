"use client";

import Button from "@/components/ui-old/button/Button";
import { Modal } from "@/components/ui-old/modal";
import { useEffect, useState } from "react";
import { useContratoStore } from "../store/useContratoStore";
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { AssinaturaCliente } from "./AssinaturaCliente";
import { AssinaturaUser } from "./AssinaturaUser";


export function ModalTermo() {

    const { openModalTermo, setOpenModalTermo, selectedTermo } = useContratoStore();


    function closeModal() {
        setOpenModalTermo(false);
    }

    return (
        <>
            <Modal
                isOpen={openModalTermo}
                onClose={closeModal}
                isFullscreen={true}
                showCloseButton={true}
            >
                <div className="fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 lg:p-10">
                    <div className="p-5 bg-white">

                        <div className="">
                            <h4 className="font-normal text-gray-800 mb-7 text-sm">
                                {selectedTermo?.titulo}
                                <hr />
                            </h4>

                            <div dangerouslySetInnerHTML={{ __html: String(selectedTermo?.conteudo) }} />

                        </div>

                        <div className="flex justify-between">
                            <AssinaturaCliente />
                            <AssinaturaUser />
                        </div>

                    </div>

                    <div className="flex items-center justify-end w-full gap-3 mt-8">
                        <Button size="sm" variant="outline" onClick={closeModal}>
                            Fechar
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}