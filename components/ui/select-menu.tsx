"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const labelId = useId();
  const valueId = useId();
  const selectedOption = options.find((option) => option.value === value);
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );

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
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      optionRefs.current[selectedIndex]?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isOpen, selectedIndex]);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    setIsOpen(true);
  };

  const handleOptionKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = index === options.length - 1 ? 0 : index + 1;
      setActiveIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousIndex = index === 0 ? options.length - 1 : index - 1;
      setActiveIndex(previousIndex);
      optionRefs.current[previousIndex]?.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      optionRefs.current[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastIndex = options.length - 1;
      setActiveIndex(lastIndex);
      optionRefs.current[lastIndex]?.focus();
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlurCapture={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={`${labelId} ${valueId}`}
        className="flex w-full flex-col items-start gap-1 rounded-panel-md border border-line-soft bg-panel px-4 py-2.5 text-left transition-all duration-150 ease-fluid hover:border-line-strong focus-visible:outline-offset-2 sm:py-3"
        data-state={isOpen ? "open" : "closed"}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span id={labelId} className="metric-kicker">
          {label}
        </span>
        <span className="flex w-full items-center justify-between gap-3">
          <span
            id={valueId}
            className="truncate text-sm font-semibold text-ink sm:text-base"
          >
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
          <ul id={listboxId} role="listbox" aria-labelledby={labelId}>
            {options.map((option, index) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value || "all"}>
                  <button
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={index === activeIndex ? 0 : -1}
                    className={`flex w-full items-center justify-between gap-3 rounded-panel-sm px-3.5 py-2.5 text-left text-sm font-semibold leading-tight text-ink transition-all duration-150 ease-fluid hover:bg-panel-soft sm:px-4 sm:py-3 sm:text-[0.95rem] ${
                      isSelected ? "bg-panel-soft" : ""
                    }`}
                    onClick={() => handleSelect(option.value)}
                    onKeyDown={(event) => handleOptionKeyDown(event, index)}
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
