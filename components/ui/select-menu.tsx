"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectMenuOption = {
  label: string;
  value: string;
};

type SelectMenuProps = {
  label: string;
  options: readonly SelectMenuOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SelectMenu({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
}: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value);

  // This closes the floating menu when someone clicks anywhere outside the
  // component, keeping the dropdown behavior predictable across the app.
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  // This gives keyboard users an immediate way to dismiss the open options
  // list without needing to move focus away from the control first.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        className="flex w-full flex-col items-start gap-1 rounded-panel-md border border-line-soft bg-panel px-4 py-2.5 text-left transition-all duration-150 ease-fluid hover:border-line-strong focus-visible:outline-offset-2 sm:py-3"
        data-state={isOpen ? "open" : "closed"}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="metric-kicker">{label}</span>
        <span className="flex w-full items-center justify-between gap-3">
          <span className="truncate text-sm font-semibold text-ink sm:text-base">
            {selectedOption?.label ?? placeholder}
          </span>
          <span
            aria-hidden="true"
            className={`text-copy-soft transition-transform duration-200 ease-fluid ${
              isOpen ? "rotate-180 text-ink" : ""
            }`}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </span>
        </span>
      </button>

      {isOpen ? (
        <div className="animate-reveal absolute top-[calc(100%+0.5rem)] left-0 right-0 z-30 max-h-60 overflow-y-auto rounded-panel-md border border-line-soft bg-panel p-2 shadow-panel-floating">
          <ul id={listboxId} role="listbox" aria-label={label}>
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value || "all"}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`flex w-full items-center justify-between gap-3 rounded-panel-sm px-3.5 py-2.5 text-left text-sm font-semibold leading-tight text-ink transition-all duration-150 ease-fluid hover:bg-panel-soft sm:px-4 sm:py-3 sm:text-[0.95rem] ${
                      isSelected ? "bg-panel-soft" : ""
                    }`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span className="truncate">{option.label}</span>
                    <span
                      aria-hidden="true"
                      className={`text-cyan-deep transition-opacity duration-150 ease-fluid ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 10.5L8 14L15.5 6.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
