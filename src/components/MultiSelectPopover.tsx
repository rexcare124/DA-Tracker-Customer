"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectPopoverProps<T> {
  /** List of items to display in the dropdown */
  items: T[];
  /** Extract unique identifier from each item (e.g. `(item) => item.id`) */
  getItemId: (item: T) => string;
  /** Extract display label from each item (e.g. `(item) => item.name`) */
  getItemLabel: (item: T) => string;
  /** Currently selected item IDs (controlled) */
  selectedIds: Set<string>;
  /** Called when selection changes (e.g. checkbox toggle or select/deselect all) */
  onSelectionChange: (selectedIds: Set<string>) => void;
  /** Optional callback when Apply is clicked; when provided, Apply button is shown and popover can be closed by parent */
  onApply?: (selectedIds: string[]) => void;
  /** Label for the trigger button (e.g. "Data types", "Categories") */
  triggerLabel?: string;
  /** Optional icon element shown before trigger label */
  triggerIcon?: React.ReactNode;
  /** Text for "Select all" action */
  selectAllLabel?: string;
  /** Text for "Deselect all" action */
  deselectAllLabel?: string;
  /** Text for Apply button */
  applyButtonLabel?: string;
  /** Message when items list is empty */
  emptyMessage?: string;
  /** When true, shows loading state inside the popover */
  isLoading?: boolean;
  /** Disables the trigger button */
  disabled?: boolean;
  /** Controlled open state of the popover */
  open?: boolean;
  /** Called when popover open state changes (for controlled usage) */
  onOpenChange?: (open: boolean) => void;
  /** Popover content alignment relative to trigger */
  align?: "start" | "center" | "end";
  /** Root wrapper class name (around the Popover) */
  className?: string;
  /** Inline styles for the root wrapper */
  style?: React.CSSProperties;
  /** Class name for the popover content panel */
  popoverContentClassName?: string;
  /** Max height of the scrollable list (e.g. "16rem", "256px") */
  listMaxHeight?: string;
  /** Render custom badge/count next to trigger when selection is non-empty; receives selected count */
  renderTriggerBadge?: (selectedCount: number) => React.ReactNode;
  /** Accessibility label for the trigger (e.g. "Filter by data type") */
  ariaLabel?: string;
  /** Size of the trigger button */
  triggerSize?: "default" | "sm" | "lg" | "icon";
  /** Variant of the trigger button */
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const DEFAULT_SELECT_ALL = "Select all";
const DEFAULT_DESELECT_ALL = "Deselect all";
const DEFAULT_APPLY = "Apply";
const DEFAULT_EMPTY_MESSAGE = "No items";

export function MultiSelectPopover<T>({
  items,
  getItemId,
  getItemLabel,
  selectedIds,
  onSelectionChange,
  onApply,
  triggerLabel = "Filter",
  triggerIcon,
  selectAllLabel = DEFAULT_SELECT_ALL,
  deselectAllLabel = DEFAULT_DESELECT_ALL,
  applyButtonLabel = DEFAULT_APPLY,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  isLoading = false,
  disabled = false,
  open,
  onOpenChange,
  align = "end",
  className,
  style,
  popoverContentClassName,
  listMaxHeight = "16rem",
  renderTriggerBadge,
  ariaLabel,
  triggerSize = "sm",
  triggerVariant = "outline",
}: MultiSelectPopoverProps<T>) {
  const allSelected = items.length > 0 && selectedIds.size >= items.length;

  const handleToggleSelectAll = React.useCallback(() => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(items.map((item) => getItemId(item))));
    }
  }, [allSelected, items, getItemId, onSelectionChange]);

  const handleApply = React.useCallback(() => {
    onApply?.(Array.from(selectedIds));
    onOpenChange?.(false);
  }, [onApply, onOpenChange, selectedIds]);

  const handleItemToggle = React.useCallback(
    (id: string, checked: boolean | "indeterminate") => {
      const next = new Set(selectedIds);
      if (checked === true) next.add(id);
      else next.delete(id);
      onSelectionChange(next);
    },
    [onSelectionChange, selectedIds],
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <div className={cn(className)} style={style}>
        <PopoverTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className="gap-1.5"
            disabled={disabled || isLoading}
            aria-label={ariaLabel ?? triggerLabel}
          >
            {triggerIcon}
            {triggerLabel}
            {renderTriggerBadge != null && selectedIds.size > 0 && renderTriggerBadge(selectedIds.size)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-72 p-0", popoverContentClassName)} align={align}>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={handleToggleSelectAll}
              disabled={items.length === 0}
            >
              {allSelected ? deselectAllLabel : selectAllLabel}
            </Button>
            {onApply != null && (
              <Button type="button" size="sm" className="h-8" onClick={handleApply}>
                {applyButtonLabel}
              </Button>
            )}
          </div>
          <div className="overflow-y-auto p-2" style={{ maxHeight: listMaxHeight }}>
            {isLoading ? (
              <div className="py-4 text-center text-sm text-gray-500">Loading…</div>
            ) : items.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">{emptyMessage}</div>
            ) : (
              <div className="space-y-1">
                {items.map((item) => {
                  const id = getItemId(item);
                  const label = getItemLabel(item);
                  return (
                    <label
                      key={id}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100"
                    >
                      <Checkbox
                        checked={selectedIds.has(id)}
                        onCheckedChange={(checked) => handleItemToggle(id, checked ?? false)}
                        aria-label={`Select ${label}`}
                      />
                      <span className="flex-1 truncate text-gray-900">{label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}
