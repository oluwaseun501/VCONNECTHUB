import { cn } from '@/lib/utils';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

function Kbd({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("kbd", {
      "data-slot": "kbd",
      className: cn(
        'bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium',
        "[&_svg:not([class*='size-'])]:size-3",
        '[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10',
        className
      ), ...
      props }, void 0, false
    ));

}

function KbdGroup({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("kbd", {
      "data-slot": "kbd-group",
      className: cn('inline-flex items-center gap-1', className), ...
      props }, void 0, false
    ));

}

export { Kbd, KbdGroup };