"use client";

import * as Select from "@radix-ui/react-select";
import { useId } from "react";

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

// Radix Select treats an empty-string value as "clear selection," so internal
// option values are mapped through this sentinel and translated back at the
// edges of the component.
const EMPTY_VALUE_SENTINEL = "__select-menu-empty__";

function toRadixValue(value: string) {
  return value === "" ? EMPTY_VALUE_SENTINEL : value;
}

function fromRadixValue(value: string) {
  return value === EMPTY_VALUE_SENTINEL ? "" : value;
}

export function SelectMenu({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
}: SelectMenuProps) {
  const labelId = useId();
  const valueId = useId();
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Select.Root
      value={toRadixValue(value)}
      onValueChange={(next) => onChange(fromRadixValue(next))}
    >
      <Select.Trigger
        aria-labelledby={`${labelId} ${valueId}`}
        className="group flex w-full flex-col items-start gap-1 rounded-panel-md border border-line-soft bg-panel px-4 py-2.5 text-left transition-all duration-150 ease-fluid hover:border-line-strong focus-visible:outline-offset-2 sm:py-3"
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
          <Select.Icon
            aria-hidden="true"
            className="text-copy-soft transition-transform duration-200 ease-fluid group-data-[state=open]:rotate-180 group-data-[state=open]:text-ink"
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
          </Select.Icon>
        </span>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="animate-reveal z-30 max-h-60 overflow-y-auto rounded-panel-md border border-line-soft bg-panel p-2 shadow-panel-floating min-w-[var(--radix-select-trigger-width)]"
        >
          <Select.Viewport>
            {options.map((option) => {
              const radixValue = toRadixValue(option.value);

              return (
                <Select.Item
                  key={radixValue}
                  value={radixValue}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-panel-sm px-3.5 py-2.5 text-left text-sm font-semibold leading-tight text-ink outline-none transition-all duration-150 ease-fluid data-[highlighted]:bg-panel-soft data-[state=checked]:bg-panel-soft sm:px-4 sm:py-3 sm:text-[0.95rem]"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator
                    aria-hidden="true"
                    className="text-cyan-deep"
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
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
