import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface LoadingDialogProps {
    open?: boolean
    message?: string
}

export default function LoadingDialog({ open = true, message }: LoadingDialogProps) {
    return (
        <Dialog open={open}>
            <DialogContent
                showCloseButton={false}
                className="flex flex-col items-center justify-center gap-4 py-5 px-4 w-[280px] rounded-lg z-9999"
            >
                <VisuallyHidden>
                    <DialogTitle>Carregando</DialogTitle>
                </VisuallyHidden>
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-sm font-medium text-gray-700 text-center">
                    {message || "Carregando..."}
                </p>
            </DialogContent>
        </Dialog>
    )
}