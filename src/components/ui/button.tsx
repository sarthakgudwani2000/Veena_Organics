"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#1F2A44] text-[#F6F1E8] hover:bg-[#2d3e66] shadow-sm",
        destructive:
          "bg-[#E53935] text-white hover:bg-[#c62828] shadow-sm",
        outline:
          "border-2 border-[#1F2A44] bg-transparent text-[#1F2A44] hover:bg-[#1F2A44] hover:text-[#F6F1E8]",
        secondary:
          "bg-[#C6A46C] text-[#1F2A44] hover:bg-[#b8925a] shadow-sm font-semibold",
        ghost:
          "hover:bg-[#E8E0D0] hover:text-[#1F2A44]",
        link:
          "text-[#C6A46C] underline-offset-4 hover:underline",
        gold:
          "bg-gradient-to-r from-[#C6A46C] to-[#d4b47c] text-[#1F2A44] hover:from-[#b8925a] hover:to-[#c6a46c] shadow-md font-semibold",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
