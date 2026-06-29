import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const ScrollArea = /*#__PURE__*/React.forwardRef(


  ({ className, children, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(ScrollAreaPrimitive.Root, {
    ref: ref,
    className: cn('relative overflow-hidden', className), ...
    props, children: [/*#__PURE__*/

    _jsxDEV(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children:
      children }, void 0, false
    ), /*#__PURE__*/
    _jsxDEV(ScrollBar, {}, void 0, false), /*#__PURE__*/
    _jsxDEV(ScrollAreaPrimitive.Corner, {}, void 0, false)] }, void 0, true
  )
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = /*#__PURE__*/React.forwardRef(


  ({ className, orientation = 'vertical', ...props }, ref) => /*#__PURE__*/
  _jsxDEV(ScrollAreaPrimitive.ScrollAreaScrollbar, {
    ref: ref,
    orientation: orientation,
    className: cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
      'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
      'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    ), ...
    props, children: /*#__PURE__*/

    _jsxDEV(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" }, void 0, false) }, void 0, false
  )
);
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };