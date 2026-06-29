import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

function ItemGroup({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      role: "list",
      "data-slot": "item-group",
      className: cn('group/item-group flex flex-col', className), ...
      props }, void 0, false
    ));

}

function ItemSeparator({
  className,
  ...props
}) {
  return (/*#__PURE__*/
    _jsxDEV(Separator, {
      "data-slot": "item-separator",
      orientation: "horizontal",
      className: cn('my-0', className), ...
      props }, void 0, false
    ));

}

const itemVariants = cva(
  'group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 [a]:transition-colors flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border-border',
        muted: 'bg-muted/50'
      },
      size: {
        default: 'gap-4 p-4 ',
        sm: 'gap-2.5 px-4 py-3'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

function Item({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props

}) {
  const Comp = asChild ? Slot : 'div';
  return (/*#__PURE__*/
    _jsxDEV(Comp, {
      "data-slot": "item",
      "data-variant": variant,
      "data-size": size,
      className: cn(itemVariants({ variant, size, className })), ...
      props }, void 0, false
    ));

}

const itemMediaVariants = cva(
  'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-muted size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
        image:
        'size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

function ItemMedia({
  className,
  variant = 'default',
  ...props
}) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "item-media",
      "data-variant": variant,
      className: cn(itemMediaVariants({ variant, className })), ...
      props }, void 0, false
    ));

}

function ItemContent({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "item-content",
      className: cn(
        'flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none',
        className
      ), ...
      props }, void 0, false
    ));

}

function ItemTitle({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "item-title",
      className: cn(
        'flex w-fit items-center gap-2 text-sm font-medium leading-snug',
        className
      ), ...
      props }, void 0, false
    ));

}

function ItemDescription({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("p", {
      "data-slot": "item-description",
      className: cn(
        'text-muted-foreground line-clamp-2 text-balance text-sm font-normal leading-normal',
        '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className
      ), ...
      props }, void 0, false
    ));

}

function ItemActions({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "item-actions",
      className: cn('flex items-center gap-2', className), ...
      props }, void 0, false
    ));

}

function ItemHeader({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "item-header",
      className: cn(
        'flex basis-full items-center justify-between gap-2',
        className
      ), ...
      props }, void 0, false
    ));

}

function ItemFooter({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      "data-slot": "item-footer",
      className: cn(
        'flex basis-full items-center justify-between gap-2',
        className
      ), ...
      props }, void 0, false
    ));

}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter };