import type { ReactNode } from "react";

type ProductsStatePanelProps = {
  kicker: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  details?: ReactNode;
  variant?: "default" | "dashed";
  className?: string;
  headingLevel?: "h2" | "h3";
};

export function ProductsStatePanel({
  kicker,
  title,
  description,
  actions,
  details,
  variant = "default",
  className,
  headingLevel = "h3",
}: ProductsStatePanelProps) {
  const panelClassName =
    variant === "dashed"
      ? "border-dashed border-line-strong bg-panel-soft"
      : "border-line-soft bg-panel";
  const HeadingTag = headingLevel;

  return (
    <div
      className={[
        "rounded-panel-lg border px-5 py-8 shadow-panel sm:px-6 sm:py-10",
        panelClassName,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="section-kicker">{kicker}</p>
      <HeadingTag className="mt-2 text-[clamp(1.5rem,1.3rem+0.8vw,2rem)]">
        {title}
      </HeadingTag>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-copy-soft sm:text-base">
        {description}
      </p>

      {details ? <div className="mt-5">{details}</div> : null}
      {actions ? <div className="mt-6 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
    </div>
  );
}
