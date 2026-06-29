'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Progress = /*#__PURE__*/React.forwardRef(


  ({ className, value, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(ProgressPrimitive.Root, {
    ref: ref,
    className: cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
      className
    ), ...
    props, children: /*#__PURE__*/

    _jsxDEV(ProgressPrimitive.Indicator, {
      className: "h-full w-full flex-1 bg-primary transition-all",
      style: { transform: `translateX(-${100 - (value || 0)}%)` } }, void 0, false
    ) }, void 0, false
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };