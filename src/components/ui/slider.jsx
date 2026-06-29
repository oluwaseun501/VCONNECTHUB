import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Slider = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(SliderPrimitive.Root, {
    ref: ref,
    className: cn(
      'relative flex w-full touch-none select-none items-center',
      className
    ), ...
    props, children: [/*#__PURE__*/

    _jsxDEV(SliderPrimitive.Track, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /*#__PURE__*/
      _jsxDEV(SliderPrimitive.Range, { className: "absolute h-full bg-primary" }, void 0, false) }, void 0, false
    ), /*#__PURE__*/
    _jsxDEV(SliderPrimitive.Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" }, void 0, false)] }, void 0, true
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };