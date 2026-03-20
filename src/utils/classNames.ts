type ClassValue = string | null | undefined | false;

export const classNames = (...args: ClassValue[]): string => {
  return args.filter(Boolean).join(" ");
};
