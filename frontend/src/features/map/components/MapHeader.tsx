import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils/cn";
import { useMapStore } from "../state/mapStore";
import { toast } from "sonner";

export function MapHeader() {
  const { activeType, setType } = useMapStore((state) => ({
    activeType: state.activeType,
    setType: state.setType,
  }));

  const handleDisabledClick = () => {
    toast.info("Clinics coming soon");
  };

  return (
    <header className="border-b bg-background/90 backdrop-blur">
      <div className="flex items-center gap-4 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
            Map
          </p>
          <h1 className="text-lg font-semibold leading-5">Nearby</h1>
        </div>

        <ToggleGroup
          type="single"
          value={activeType}
          onValueChange={(val) => {
            if (val === "clinic") {
              handleDisabledClick();
              return;
            }
            if (val) setType(val as "pharmacy");
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
            className="relative min-w-[110px] opacity-60"
            onClick={handleDisabledClick}
            aria-disabled
            disabled
          >
            Клиники
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </header>
  );
}
