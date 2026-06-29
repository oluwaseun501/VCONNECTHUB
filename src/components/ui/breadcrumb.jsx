import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { ChevronRight, MoreHorizontal } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Breadcrumb = /*#__PURE__*/React.forwardRef(




  ({ ...props }, ref) => /*#__PURE__*/_jsxDEV("nav", { ref: ref, "aria-label": "breadcrumb", ...props }, void 0, false));
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("ol", {
    ref: ref,
    className: cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      className
    ), ...
    props }, void 0, false
  )
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("li", {
    ref: ref,
    className: cn('inline-flex items-center gap-1.5', className), ...
    props }, void 0, false
  )
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = /*#__PURE__*/React.forwardRef(




  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';

    return (/*#__PURE__*/
      _jsxDEV(Comp, {
        ref: ref,
        className: cn('transition-colors hover:text-foreground', className), ...
        props }, void 0, false
      ));

  });
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("span", {
    ref: ref,
    role: "link",
    "aria-disabled": "true",
    "aria-current": "page",
    className: cn('font-normal text-foreground', className), ...
    props }, void 0, false
  )
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV("li", {
  role: "presentation",
  "aria-hidden": "true",
  className: cn('[&>svg]:w-3.5 [&>svg]:h-3.5', className), ...
  props, children:

  children ?? /*#__PURE__*/_jsxDEV(ChevronRight, {}, void 0, false) }, void 0, false
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV("span", {
  role: "presentation",
  "aria-hidden": "true",
  className: cn('flex h-9 w-9 items-center justify-center', className), ...
  props, children: [/*#__PURE__*/

  _jsxDEV(MoreHorizontal, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
  _jsxDEV("span", { className: "sr-only", children: "More" }, void 0, false)] }, void 0, true
);

BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis };