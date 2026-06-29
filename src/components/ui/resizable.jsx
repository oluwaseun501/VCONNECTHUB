'use client';

import * as ResizablePrimitive from 'react-resizable-panels';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const ResizablePanelGroup = ({
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV(ResizablePrimitive.PanelGroup, {
  className: cn(
    'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
    className
  ), ...
  props }, void 0, false
);


const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props


}) => /*#__PURE__*/
_jsxDEV(ResizablePrimitive.PanelResizeHandle, {
  className: cn(
    'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
    className
  ), ...
  props, children:

  withHandle && /*#__PURE__*/
  _jsxDEV("div", { className: "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border", children: /*#__PURE__*/
    _jsxDEV(GripVertical, { className: "h-2.5 w-2.5" }, void 0, false) }, void 0, false
  ) }, void 0, false

);


export { ResizablePanelGroup, ResizablePanel, ResizableHandle };