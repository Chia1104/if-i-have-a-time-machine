import React, { type FC, type ComponentProps } from "react";
import { cn } from "@/utils";

const HeroButton: FC<ComponentProps<"button">> = (props) => {
  const { children, disabled, className, ...rest } = props;
  return (
    <button
      disabled={disabled}
      className={cn(
        "group relative inline-flex self-center rounded bg-ctw_secondary transition ease-in-out dark:bg-ctw_primary",
        className
      )}
      {...rest}>
      <span
        className={cn(
          "ctw-component-button-secondary transform text-base",
          disabled
            ? "cursor-not-allowed text-gray-400"
            : "group-hover:-translate-x-1 group-hover:-translate-y-1"
        )}>
        {children}
      </span>
    </button>
  );
};

export default HeroButton;
