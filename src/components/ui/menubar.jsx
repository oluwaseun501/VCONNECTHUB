import * as React from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, Circle } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

function MenubarMenu({
  ...props
}) {
  return /*#__PURE__*/_jsxDEV(MenubarPrimitive.Menu, { ...props }, void 0, false);
}

function MenubarGroup({
  ...props
}) {
  return /*#__PURE__*/_jsxDEV(MenubarPrimitive.Group, { ...props }, void 0, false);
}

function MenubarPortal({
  ...props
}) {
  return /*#__PURE__*/_jsxDEV(MenubarPrimitive.Portal, { ...props }, void 0, false);
}

function MenubarRadioGroup({
  ...props
}) {
  return /*#__PURE__*/_jsxDEV(MenubarPrimitive.RadioGroup, { ...props }, void 0, false);
}

function MenubarSub({
  ...props
}) {
  return /*#__PURE__*/_jsxDEV(MenubarPrimitive.Sub, { "data-slot": "menubar-sub", ...props }, void 0, false);
}

const Menubar = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(MenubarPrimitive.Root, {
    ref: ref,
    className: cn(
      'flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm',
      className
    ), ...
    props }, void 0, false
  )
);
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(MenubarPrimitive.Trigger, {
    ref: ref,
    className: cn(
      'flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      className
    ), ...
    props }, void 0, false
  )
);
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = /*#__PURE__*/React.forwardRef(




  ({ className, inset, children, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(MenubarPrimitive.SubTrigger, {
    ref: ref,
    className: cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      inset && 'pl-8',
      className
    ), ...
    props, children: [

    children, /*#__PURE__*/
    _jsxDEV(ChevronRight, { className: "ml-auto h-4 w-4" }, void 0, false)] }, void 0, true
  )
);
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(MenubarPrimitive.SubContent, {
    ref: ref,
    className: cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]',
      className
    ), ...
    props }, void 0, false
  )
);
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = /*#__PURE__*/React.forwardRef(



  (
  { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
  ref) => /*#__PURE__*/

  _jsxDEV(MenubarPrimitive.Portal, { children: /*#__PURE__*/
    _jsxDEV(MenubarPrimitive.Content, {
      ref: ref,
      align: align,
      alignOffset: alignOffset,
      sideOffset: sideOffset,
      className: cn(
        'z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]',
        className
      ), ...
      props }, void 0, false
    ) }, void 0, false
  )

);
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = /*#__PURE__*/React.forwardRef(




  ({ className, inset, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(MenubarPrimitive.Item, {
    ref: ref,
    className: cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    ), ...
    props }, void 0, false
  )
);
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = /*#__PURE__*/React.forwardRef(


  ({ className, children, checked, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(MenubarPrimitive.CheckboxItem, {
    ref: ref,
    className: cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    ),
    checked: checked, ...
    props, children: [/*#__PURE__*/

    _jsxDEV("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /*#__PURE__*/
      _jsxDEV(MenubarPrimitive.ItemIndicator, { children: /*#__PURE__*/
        _jsxDEV(Check, { className: "h-4 w-4" }, void 0, false) }, void 0, false
      ) }, void 0, false
    ),
    children] }, void 0, true
  )
);
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = /*#__PURE__*/React.forwardRef(


  ({ className, children, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(MenubarPrimitive.RadioItem, {
    ref: ref,
    className: cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    ), ...
    props, children: [/*#__PURE__*/

    _jsxDEV("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /*#__PURE__*/
      _jsxDEV(MenubarPrimitive.ItemIndicator, { children: /*#__PURE__*/
        _jsxDEV(Circle, { className: "h-4 w-4 fill-current" }, void 0, false) }, void 0, false
      ) }, void 0, false
    ),
    children] }, void 0, true
  )
);
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = /*#__PURE__*/React.forwardRef(




  ({ className, inset, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(MenubarPrimitive.Label, {
    ref: ref,
    className: cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    ), ...
    props }, void 0, false
  )
);
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(MenubarPrimitive.Separator, {
    ref: ref,
    className: cn('-mx-1 my-1 h-px bg-muted', className), ...
    props }, void 0, false
  )
);
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({
  className,
  ...props
}) => {
  return (/*#__PURE__*/
    _jsxDEV("span", {
      className: cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className
      ), ...
      props }, void 0, false
    ));

};
MenubarShortcut.displayname = 'MenubarShortcut';

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut };