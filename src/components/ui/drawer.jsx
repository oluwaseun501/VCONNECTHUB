import * as React from 'react';
import { cn } from '@/lib/utils';
import { Drawer as DrawerPrimitive } from 'vaul';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}) => /*#__PURE__*/
_jsxDEV(DrawerPrimitive.Root, {
  shouldScaleBackground: shouldScaleBackground, ...
  props }, void 0, false
);

Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(DrawerPrimitive.Overlay, {
    ref: ref,
    className: cn('fixed inset-0 z-50 bg-black/80', className), ...
    props }, void 0, false
  )
);
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = /*#__PURE__*/React.forwardRef(


  ({ className, children, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(DrawerPortal, { children: [/*#__PURE__*/
    _jsxDEV(DrawerOverlay, {}, void 0, false), /*#__PURE__*/
    _jsxDEV(DrawerPrimitive.Content, {
      ref: ref,
      className: cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className
      ), ...
      props, children: [/*#__PURE__*/

      _jsxDEV("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }, void 0, false),
      children] }, void 0, true
    )] }, void 0, true
  )
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV("div", {
  className: cn('grid gap-1.5 p-4 text-center sm:text-left', className), ...
  props }, void 0, false
);

DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV("div", {
  className: cn('mt-auto flex flex-col gap-2 p-4', className), ...
  props }, void 0, false
);

DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(DrawerPrimitive.Title, {
    ref: ref,
    className: cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    ), ...
    props }, void 0, false
  )
);
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(DrawerPrimitive.Description, {
    ref: ref,
    className: cn('text-sm text-muted-foreground', className), ...
    props }, void 0, false
  )
);
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription };