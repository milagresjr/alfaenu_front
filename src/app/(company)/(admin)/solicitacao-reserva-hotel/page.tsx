import type { Metadata } from "next";
import SoliReservaHotelTable from "./_components/SoliReservaHotelTable"

export const metadata: Metadata = {
  title: "Solicitações de Reserva de Hotel",
  description: "Gestão de solicitações de reserva de hotel no sistema Alfaenu",
};

export default function SolicitacaoReservaHotelPage() {
  return <SoliReservaHotelTable />
}
