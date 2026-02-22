import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils/cn";
import { useMapStore } from "../state/mapStore";

export function MapHeader() {
  const { activeType, setType } = useMapStore((state) => ({
    activeType: state.activeType,
    setType: state.setType,
  }));

  return (
    <header className="border-b bg-background/90 backdrop-blur">
      <div className="flex items-center gap-4 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
            Карта
          </p>
          <h1 className="text-lg font-semibold leading-5">Рядом</h1>
        </div>

        <ToggleGroup
          type="single"
          value={activeType}
          onValueChange={(val) => {
            if (val) setType(val as "pharmacy" | "clinic");
          }}
          className="rounded-lg bg-muted/60 p-1"
        >
          <ToggleGroupItem
            value="pharmacy"
            className={cn(
              "px-4 font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm",
              "min-w-[110px]",
            )}
          >
            Аптеки
          </ToggleGroupItem>
          <ToggleGroupItem
            value="clinic"
            className={cn(
              "px-4 font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm",
              "min-w-[110px]",
            )}
          >
            Клиники
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </header>
  );
}
