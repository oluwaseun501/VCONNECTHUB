import * as React from "react";
import { cn } from "@/lib/utils";import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const Card = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", {
    ref: ref,
    className: cn("rounded-xl border bg-card/60 backdrop-blur-xl text-card-foreground shadow-sm", className), ...
    props }, void 0, false
  )

);
Card.displayName = "Card";

const CardHeader = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", {
    ref: ref,
    className: cn("flex flex-col space-y-1.5 p-6", className), ...
    props }, void 0, false
  )

);
CardHeader.displayName = "CardHeader";

const CardTitle = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("h3", {
    ref: ref,
    className: cn("font-semibold leading-none tracking-tight", className), ...
    props }, void 0, false
  )

);
CardTitle.displayName = "CardTitle";

const CardDescription = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("p", {
    ref: ref,
    className: cn("text-sm text-muted-foreground", className), ...
    props }, void 0, false
  )

);
CardDescription.displayName = "CardDescription";

const CardContent = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", { ref: ref, className: cn("p-6 pt-0", className), ...props }, void 0, false)

);
CardContent.displayName = "CardContent";

const CardFooter = /*#__PURE__*/React.forwardRef(
  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", {
    ref: ref,
    className: cn("flex items-center p-6 pt-0", className), ...
    props }, void 0, false
  )

);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };