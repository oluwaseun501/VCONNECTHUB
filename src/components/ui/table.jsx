import * as React from "react";
import { cn } from "@/lib/utils";import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Table = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", { className: "relative w-full overflow-auto", children: /*#__PURE__*/
    _jsxDEV("table", {
      ref: ref,
      className: cn("w-full caption-bottom text-sm", className), ...
      props }, void 0, false
    ) }, void 0, false
  )

);
Table.displayName = "Table";

const TableHeader = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("thead", { ref: ref, className: cn("[&_tr]:border-b border-border", className), ...props }, void 0, false)

);
TableHeader.displayName = "TableHeader";

const TableBody = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("tbody", {
    ref: ref,
    className: cn("[&_tr:last-child]:border-0", className), ...
    props }, void 0, false
  )

);
TableBody.displayName = "TableBody";

const TableRow = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("tr", {
    ref: ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ), ...
    props }, void 0, false
  )

);
TableRow.displayName = "TableRow";

const TableHead = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("th", {
    ref: ref,
    className: cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    ), ...
    props }, void 0, false
  )

);
TableHead.displayName = "TableHead";

const TableCell = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("td", {
    ref: ref,
    className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className), ...
    props }, void 0, false
  )

);
TableCell.displayName = "TableCell";

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell };