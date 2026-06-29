import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const NavigationMenu = /*#__PURE__*/React.forwardRef(


  ({ className, children, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(NavigationMenuPrimitive.Root, {
    ref: ref,
    className: cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className
    ), ...
    props, children: [

    children, /*#__PURE__*/
    _jsxDEV(NavigationMenuViewport, {}, void 0, false)] }, void 0, true
  )
);
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(NavigationMenuPrimitive.List, {
    ref: ref,
    className: cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className
    ), ...
    props }, void 0, false
  )
);
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent'
);

const NavigationMenuTrigger = /*#__PURE__*/React.forwardRef(


  ({ className, children, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(NavigationMenuPrimitive.Trigger, {
    ref: ref,
    className: cn(navigationMenuTriggerStyle(), 'group', className), ...
    props, children: [

    children, ' ', /*#__PURE__*/
    _jsxDEV(ChevronDown, {
      className: "relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180",
      "aria-hidden": "true" }, void 0, false
    )] }, void 0, true
  )
);
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(NavigationMenuPrimitive.Content, {
    ref: ref,
    className: cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ',
      className
    ), ...
    props }, void 0, false
  )
);
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", { className: cn('absolute left-0 top-full flex justify-center'), children: /*#__PURE__*/
    _jsxDEV(NavigationMenuPrimitive.Viewport, {
      className: cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className
      ),
      ref: ref, ...
      props }, void 0, false
    ) }, void 0, false
  )
);
NavigationMenuViewport.displayName =
NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(NavigationMenuPrimitive.Indicator, {
    ref: ref,
    className: cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className
    ), ...
    props, children: /*#__PURE__*/

    _jsxDEV("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" }, void 0, false) }, void 0, false
  )
);
NavigationMenuIndicator.displayName =
NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport };