import { AnimatePresence, motion } from "framer-motion";

interface MapOverlaysProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}

export function MapOverlays({ isLoading, isError, isEmpty }: MapOverlaysProps) {
  return (
    <div className="pointer-events-none absolute left-4 top-4 z-20 flex flex-col gap-2">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
            className="pointer-events-auto rounded-full bg-background/90 px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-border backdrop-blur"
          >
            Поиск по близости...
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEmpty && !isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
            className="pointer-events-auto rounded-full bg-background/90 px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-border backdrop-blur"
          >
            Не найдено аптек в этой области.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
            className="pointer-events-auto rounded-full bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive shadow-lg ring-1 ring-destructive/40 backdrop-blur"
          >
            Не удалось загрузить нужные места. Повторите попытку.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
