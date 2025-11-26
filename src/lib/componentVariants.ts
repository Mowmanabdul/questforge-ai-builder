import { cn } from "@/lib/utils";

// Standardized component variants for consistent design
export const componentVariants = {
  // Card variants
  card: {
    default: "card-default",
    compact: "card-compact", 
    mobile: "card-mobile",
  },
  
  // Icon variants
  icon: {
    sm: "icon-sm",
    md: "icon-md",
    lg: "icon-lg", 
    xl: "icon-xl",
  },
  
  // Button combinations
  button: {
    primary: "variant-default",
    gradient: "variant-gradient",
    outline: "variant-outline",
    ghost: "variant-ghost",
  },
  
  // Animation variants
  animation: {
    hover: "hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
    cardHover: "card-hover",
    fadeIn: "animate-fade-in",
  },
};

// Utility function to apply consistent styling
export const applyVariant = (
  base: string,
  variant: keyof typeof componentVariants,
  size?: string,
  className?: string
) => {
  const variantClass = componentVariants[variant];
  const sizeClass = size && typeof variantClass === "object" ? variantClass[size as keyof typeof variantClass] : variantClass;
  
  return cn(base, sizeClass, className);
};

// Predefined component combinations
export const standardComponents = {
  questCard: "card-default card-hover transition-all duration-300",
  primaryButton: "variant-gradient icon-sm",
  mobileButton: "variant-default card-mobile",
  headerIcon: "icon-md",
  navIcon: "icon-sm",
};
