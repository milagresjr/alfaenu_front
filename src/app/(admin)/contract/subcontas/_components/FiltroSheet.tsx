import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useRef } from "react";
import { useSubcontaContratoStore } from "@/features/subcontas-contrato/store/useSubcontaContratoStore";

export function FiltroSheet({
  openSheet,
  setOpenSheet,
}: {
  openSheet: boolean;
  setOpenSheet: (v: boolean) => void;
}) {
  const [tipo, setTipo] = useState<string | null>(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [valorMin, setValorMin] = useState("");
  const [valorMax, setValorMax] = useState("");

  const { setFilters } = useSubcontaContratoStore();

  const refDate1 = useRef<HTMLInputElement>(null);
  const refDate2 = useRef<HTMLInputElement>(null);

  function handleAplicar() {
    const filtros = {
      tipo,
      dataInicio,
      dataFim,
      valorMin: Number(valorMin),
      valorMax: Number(valorMax),
    };
    setFilters(filtros);
    setOpenSheet(false);
  }

  function handleLimpar() {
    setTipo(null);
    setDataInicio("");
    setDataFim("");
    setValorMin("");
    setValorMax("");
    setFilters({
      tipo: null,
      dataInicio: null,
      dataFim: null,
      valorMin: null,
      valorMax: null,
    });
    setOpenSheet(false);
  }

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Aplicar Filtros</SheetTitle>
          <SheetDescription>
            Selecione os critérios abaixo para refinar os resultados.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-3 overflow-y-auto max-h-[80vh] pb-3 custom-scrollbar">
          {/* Tipo */}
          <div>
            <label className="block text-sm mb-2">Tipo de Movimento</label>
            <Select value={tipo || ""} onValueChange={setTipo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[9999]">
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Intervalo de Datas */}
          <div>
            <label className="block text-sm mb-2">Intervalo de Datas</label>
            <div className="space-y-1">
              <div>
                <span className="text-xs text-muted-foreground">De</span>
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  ref={refDate1}
                  onClick={() => {
                    if (refDate1.current && "showPicker" in refDate1.current) {
                      // força abrir o calendário nativo
                      (refDate1.current as any).showPicker();
                    }
                  }}
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Até</span>
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  ref={refDate2}
                  onClick={() => {
                    if (refDate2.current && "showPicker" in refDate2.current) {
                      // força abrir o calendário nativo
                      (refDate2.current as any).showPicker();
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Intervalo de Valores */}
          <div>
            <label className="block text-sm mb-2">Intervalo de Valores</label>
            <div className="space-y-1">
              <div>
                <span className="text-xs text-muted-foreground">De</span>
                <Input
                  type="number"
                  placeholder="Mínimo"
                  value={valorMin}
                  onChange={(e) => setValorMin(e.target.value)}
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Até</span>
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={valorMax}
                  onChange={(e) => setValorMax(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={handleLimpar}>
              Limpar Filtros
            </Button>
            <Button onClick={handleAplicar}>Aplicar Filtros</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
