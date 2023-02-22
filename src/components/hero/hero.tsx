import { type FC, type ComponentProps } from "react";
import { cn } from "@/utils";
import styles from "./hero.module.css";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0 },
  active: { opacity: 1 },
};

const Hero: FC<ComponentProps<"div">> = ({ className, children }) => {
  return (
    <div
      className={cn(
        styles["counter-border"],
        "h-[304]px ctw-component-bg-secondary w-[calc(100%_-_0px)] sm:h-[352px] sm:!w-[488px]"
      )}>
      <motion.i
        initial="hidden"
        animate={"active"}
        variants={variants}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative flex h-full w-full max-w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[rgba(255,255,255,0.05)] p-3 !pb-12 pt-8 md:!pb-4 md:!pt-4",
          className
        )}>
        <div className="flex flex-1 flex-col items-center">{children}</div>
      </div>
    </div>
  );
};

export default Hero;
