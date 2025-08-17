// import * as React from "react"
// import { Slot } from "@radix-ui/react-slot"
// import { cva, type VariantProps } from "class-variance-authority"

// import { cn } from "../lib/utils"

// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive:
//           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline:
//           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button"
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Button.displayName = "Button"

// export { Button, buttonVariants }




//  version 2 
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4cc9ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#4cc9ff] to-[#00fff0] text-white hover:from-[#4cc9ff]/90 hover:to-[#00fff0]/90 shadow-[0_0_20px_rgba(76,201,255,0.4)] hover:shadow-[0_0_25px_rgba(76,201,255,0.6)] border border-[#4cc9ff]/30 backdrop-blur-sm",
        destructive: "bg-gradient-to-r from-[#7a5cff] to-[#4cc9ff] text-white hover:from-[#7a5cff]/90 hover:to-[#4cc9ff]/90 shadow-[0_0_20px_rgba(122,92,255,0.4)] border border-[#7a5cff]/30 backdrop-blur-sm",
        outline: "border border-[#4cc9ff]/40 bg-gradient-to-r from-black/60 to-black/40 text-[#4cc9ff] hover:bg-gradient-to-r hover:from-[#4cc9ff]/10 hover:to-[#00fff0]/10 hover:text-[#00fff0] hover:border-[#4cc9ff]/80 backdrop-blur-sm",
        secondary: "bg-gradient-to-r from-white/[0.03] via-white/[0.01] to-transparent text-white/80 hover:text-white border border-white/10 hover:border-white/20 backdrop-blur-sm",
        ghost: "text-white/70 hover:bg-gradient-to-r hover:from-[#4cc9ff]/10 hover:to-[#00fff0]/10 hover:text-[#4cc9ff]",
        link: "text-[#4cc9ff] underline-offset-4 hover:underline hover:text-[#00fff0]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Glass highlight for primary variants */}
        {(variant === "default" || variant === "destructive") && (
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
        )}
        
        {/* Liquid flow background for default variant */}
        {variant === "default" && (
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'radial-gradient(70% 100% at 30% 50%, rgba(76,201,255,0.15), rgba(0,255,240,0.1) 50%, transparent 80%)',
                animation: 'buttonFlow 3s ease-in-out infinite alternate'
              }}
            />
          </div>
        )}

        {/* Scanning line effect for outline variant */}
        {variant === "outline" && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div
              className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4cc9ff] to-transparent"
              style={{
                animation: 'scanLine 2s linear infinite'
              }}
            />
          </div>
        )}

        {/* Content wrapper */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        <style jsx>{`
          @keyframes buttonFlow {
            0% { 
              transform: translateX(-10%) rotate(0deg) scale(1); 
            }
            100% { 
              transform: translateX(10%) rotate(1deg) scale(1.02); 
            }
          }
          @keyframes scanLine {
            0% { 
              transform: translateX(-100%); 
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% { 
              transform: translateX(200%); 
              opacity: 0;
            }
          }
        `}</style>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
