import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Checkbox = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(CheckboxPrimitive.Root, {
    ref: ref,
    className: cn(
      'grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className
    ), ...
    props, children: /*#__PURE__*/

    _jsxDEV(CheckboxPrimitive.Indicator, {
      className: cn('grid place-content-center text-current'), children: /*#__PURE__*/

      _jsxDEV(Check, { className: "h-4 w-4" }, void 0, false) }, void 0, false
    ) }, void 0, false
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };