import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Separator = /*#__PURE__*/React.forwardRef(



  (
  { className, orientation = 'horizontal', decorative = true, ...props },
  ref) => /*#__PURE__*/

  _jsxDEV(SeparatorPrimitive.Root, {
    ref: ref,
    decorative: decorative,
    orientation: orientation,
    className: cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    ), ...
    props }, void 0, false
  )

);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };