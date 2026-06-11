import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileLayout({ children, bottomNav, header }: { children: React.ReactNode; bottomNav?: React.ReactNode; header?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[430px] min-h-[100dvh] bg-gray-50 flex flex-col relative shadow-2xl overflow-hidden">
      {header && (
        <div className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
          {header}
        </div>
      )}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {bottomNav && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
          {bottomNav}
        </div>
      )}
    </div>
  );
}