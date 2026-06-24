import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1F2A44] text-[#F6F1E8] hover:bg-[#2d3e66]",
        secondary:
          "border-transparent bg-[#C6A46C] text-[#1F2A44] hover:bg-[#b8925a]",
        destructive:
          "border-transparent bg-[#E53935] text-white hover:bg-[#c62828]",
        outline:
          "text-[#1F2A44] border-[#1F2A44]",
        success:
          "border-transparent bg-green-100 text-green-800",
        muted:
          "border-transparent bg-[#E8E0D0] text-[#6B6B6B]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
