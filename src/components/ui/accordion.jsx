import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(AccordionPrimitive.Item, {
    ref: ref,
    className: cn('border-b', className), ...
    props }, void 0, false
  )
);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = /*#__PURE__*/React.forwardRef(


  ({ className, children, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(AccordionPrimitive.Header, { className: "flex", children: /*#__PURE__*/
    _jsxDEV(AccordionPrimitive.Trigger, {
      ref: ref,
      className: cn(
        'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180',
        className
      ), ...
      props, children: [

      children, /*#__PURE__*/
      _jsxDEV(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" }, void 0, false)] }, void 0, true
    ) }, void 0, false
  )
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = /*#__PURE__*/React.forwardRef(


  ({ className, children, ...props }, ref) => /*#__PURE__*/
  _jsxDEV(AccordionPrimitive.Content, {
    ref: ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down", ...
    props, children: /*#__PURE__*/

    _jsxDEV("div", { className: cn('pb-4 pt-0', className), children: children }, void 0, false) }, void 0, false
  )
);
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };