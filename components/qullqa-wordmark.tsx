import { cn } from "@/lib/utils";

type QullqaWordmarkProps = {
  className?: string;
};

export function QullqaWordmark({ className }: QullqaWordmarkProps) {
  return (
    <span
      className={cn(
        "font-medium lowercase tracking-tight text-foreground [font-family:var(--font-manrope)]",
        className,
      )}
    >
      qullqa
    </span>
  );
}
