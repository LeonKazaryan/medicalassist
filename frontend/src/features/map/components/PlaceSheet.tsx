import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search, X } from "lucide-react";
import type { Place } from "@/types/place";
import { PlaceCard } from "./PlaceCard";
import { PlaceListItem } from "./PlaceListItem";
import { Button } from "@/components/ui/button";
import { MapHeader } from "./MapHeader";

interface PlaceSheetProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelect: (place: Place | null) => void;
  onClose: () => void;
  isLoading: boolean;
  isError: boolean;
  sidebarControls?: ReactNode;
}

const sheetTransition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };

export function PlaceSheet({
  places,
  selectedPlace,
  onSelect,
  onClose,
  isLoading,
  isError,
  sidebarControls,
}: PlaceSheetProps) {

  const renderContent = () => {
    if (isLoading && places.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground animate-in fade-in duration-500">
          <div className="relative">
            <Search className="h-10 w-10 animate-pulse" />
            <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full bg-primary/20" />
          </div>
          <p className="text-sm font-medium">Ищем аптеки поблизости...</p>
        </div>
      );
    }

    if (isError && places.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4 animate-in fade-in duration-500">
          <div className="rounded-full bg-destructive/10 p-4">
            <X className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Произошла ошибка</p>
            <p className="text-sm text-muted-foreground">Не удалось загрузить список аптек. Проверьте соединение.</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>Попробовать снова</Button>
        </div>
      );
    }

    if (selectedPlace) {
      return (
        <motion.div
          key="details"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={sheetTransition}
          className="flex flex-col h-full bg-background"
        >
          <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onSelect(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 overflow-hidden">
              <h2 className="truncate font-semibold leading-none">Детали аптеки</h2>
              <p className="truncate text-xs text-muted-foreground">Вернуться к списку</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <PlaceCard place={selectedPlace} />
          </div>
        </motion.div>
      );
    }

    if (places.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
          <Search className="h-10 w-10 mb-4 opacity-20" />
          <p className="text-sm font-medium">В этой области аптек не найдено</p>
          <p className="text-xs mt-1">Попробуйте изменить масштаб или переместить карту</p>
        </div>
      );
    }

    return (
      <motion.div
        key="list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={sheetTransition}
        className="flex flex-col h-full"
      >
        <div className="border-b bg-muted/30 px-4 py-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Результаты ({places.length})
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {places.map((place) => (
            <PlaceListItem
              key={place.id}
              place={place}
              isSelected={place.id === selectedPlace?.id}
              onClick={() => onSelect(place)}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            key="mobile-sheet"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: sheetTransition }}
            exit={{ y: "100%", opacity: 0, transition: sheetTransition }}
            className="fixed inset-x-0 bottom-0 z-[100] rounded-t-[2.5rem] border-t bg-background shadow-[0_-8px_30px_rgb(0,0,0,0.12)] lg:hidden overflow-hidden"
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/20" />
            <div className="flex items-center justify-between px-6 pb-2 pt-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                Выбрано
              </p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto px-6 pb-12">
              <PlaceCard place={selectedPlace} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop side panel (always visible on lg) */}
      <div className="fixed right-0 top-16 hidden h-[calc(100vh-64px)] w-[360px] border-l bg-background/95 shadow-2xl backdrop-blur-md lg:block z-20">
        <div className="flex h-full flex-col">
          <MapHeader />

          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>

          {sidebarControls && (
            <div className="border-t bg-background/95 p-4 backdrop-blur">
              {sidebarControls}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

