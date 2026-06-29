import * as React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Pagination = ({ className, ...props }) => /*#__PURE__*/
_jsxDEV("nav", {
  role: "navigation",
  "aria-label": "pagination",
  className: cn('mx-auto flex w-full justify-center', className), ...
  props }, void 0, false
);

Pagination.displayName = 'Pagination';

const PaginationContent = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("ul", {
    ref: ref,
    className: cn('flex flex-row items-center gap-1', className), ...
    props }, void 0, false
  )
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("li", { ref: ref, className: cn('', className), ...props }, void 0, false)
);
PaginationItem.displayName = 'PaginationItem';






const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}) => /*#__PURE__*/
_jsxDEV("a", {
  "aria-current": isActive ? 'page' : undefined,
  className: cn(
    buttonVariants({
      variant: isActive ? 'outline' : 'ghost',
      size
    }),
    className
  ), ...
  props }, void 0, false
);

PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV(PaginationLink, {
  "aria-label": "Go to previous page",
  size: "default",
  className: cn('gap-1 pl-2.5', className), ...
  props, children: [/*#__PURE__*/

  _jsxDEV(ChevronLeft, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
  _jsxDEV("span", { children: "Previous" }, void 0, false)] }, void 0, true
);

PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV(PaginationLink, {
  "aria-label": "Go to next page",
  size: "default",
  className: cn('gap-1 pr-2.5', className), ...
  props, children: [/*#__PURE__*/

  _jsxDEV("span", { children: "Next" }, void 0, false), /*#__PURE__*/
  _jsxDEV(ChevronRight, { className: "h-4 w-4" }, void 0, false)] }, void 0, true
);

PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}) => /*#__PURE__*/
_jsxDEV("span", {
  "aria-hidden": true,
  className: cn('flex h-9 w-9 items-center justify-center', className), ...
  props, children: [/*#__PURE__*/

  _jsxDEV(MoreHorizontal, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
  _jsxDEV("span", { className: "sr-only", children: "More pages" }, void 0, false)] }, void 0, true
);

PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis };