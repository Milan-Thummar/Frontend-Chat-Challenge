import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { classNames } from "../utils/classNames";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: ButtonVariant;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-button text-white hover:brightness-95 hover:shadow-md active:scale-[0.98] disabled:hover:shadow-none disabled:hover:brightness-100 disabled:active:scale-100",
  secondary:
    "border border-border bg-white text-app-text hover:bg-gray-50 disabled:hover:bg-white",
};

export const Button = ({
  children,
  isLoading = false,
  variant = "primary",
  className,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={classNames(
        "h-15 cursor-pointer rounded-md px-4 text-base font-medium tracking-wide transition-all duration-200 ease-in-out sm:px-6",
        VARIANT_STYLES[variant],
        "disabled:cursor-not-allowed disabled:opacity-75",
        className
      )}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
