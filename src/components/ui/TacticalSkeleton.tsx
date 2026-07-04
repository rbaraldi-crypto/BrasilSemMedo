import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TacticalSkeletonProps {
  className?: string;
  lines?: number;
}

export function TacticalSkeleton({ className, lines = 3 }: TacticalSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="relative h-4 w-full bg-slate-900 overflow-hidden rounded border border-white/5">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
              delay: i * 0.2,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />
          <div className="absolute inset-0 flex items-center px-2">
            <div className="h-[1px] w-full bg-primary/10" />
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-mono text-primary/40 animate-pulse">DECRYPTING_DATA_STREAM...</span>
        <span className="text-[8px] font-mono text-primary/40">SECURE_LINK_V2</span>
      </div>
    </div>
  );
}
