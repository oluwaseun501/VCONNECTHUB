import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

function Empty({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "empty",
      className: cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12',
        className
      ), ...
      props }, void 0, false
    ));

}

function EmptyHeader({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "empty-header",
      className: cn(
        'flex max-w-sm flex-col items-center gap-2 text-center',
        className
      ), ...
      props }, void 0, false
    ));

}

const emptyMediaVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6"
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "empty-icon",
      "data-variant": variant,
      className: cn(emptyMediaVariants({ variant, className })), ...
      props }, void 0, false
    ));

}

function EmptyTitle({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "empty-title",
      className: cn('text-lg font-medium tracking-tight', className), ...
      props }, void 0, false
    ));

}

function EmptyDescription({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "empty-description",
      className: cn(
        'text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
        className
      ), ...
      props }, void 0, false
    ));

}

function EmptyContent({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "empty-content",
      className: cn(
        'flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm',
        className
      ), ...
      props }, void 0, false
    ));

}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia };