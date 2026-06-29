import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(DialogPrimitive.Overlay, {
    ref: ref,
    className: cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    ), ...
    props }, void 0, false
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = /*#__PURE__*/React.forwardRef(


  ({ className, children, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(DialogPortal, { children: [/*#__PURE__*/
    _jsxDEV(DialogOverlay, {}, void 0, false), /*#__PURE__*/
    _jsxDEV(DialogPrimitive.Content, {
      ref: ref,
      className: cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg max-h-[85vh] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      ), ...
      props, children: [

      children, /*#__PURE__*/
      _jsxDEV(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [/*#__PURE__*/
        _jsxDEV(X, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { className: "sr-only", children: "Close" }, void 0, false)] }, void 0, true
      )] }, void 0, true
    )] }, void 0, true
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV("div", {
  className: cn(
    'flex flex-col space-y-1.5 text-center sm:text-left',
    className
  ), ...
  props }, void 0, false
);

DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV("div", {
  className: cn(
    'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
    className
  ), ...
  props }, void 0, false
);

DialogFooter.displayName = 'DialogFooter';

const DialogTitle = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(DialogPrimitive.Title, {
    ref: ref,
    className: cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    ), ...
    props }, void 0, false
  )
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(DialogPrimitive.Description, {
    ref: ref,
    className: cn('text-sm text-muted-foreground', className), ...
    props }, void 0, false
  )
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription };