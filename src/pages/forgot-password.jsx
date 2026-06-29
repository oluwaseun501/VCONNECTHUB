import React, { useState } from "react";
import { Link } from "wouter";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  return (/*#__PURE__*/
    _jsxDEV(AuthLayout, {
      title: "Reset Password",
      subtitle: "We'll send you a link to reset your password.", children:

      !submitted ? /*#__PURE__*/
      _jsxDEV("form", { className: "space-y-6", onSubmit: (e) => {e.preventDefault();setSubmitted(true);}, children: [/*#__PURE__*/
        _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
          _jsxDEV(Label, { htmlFor: "email", className: "text-sm font-medium", children: "Email Address" }, void 0, false), /*#__PURE__*/
          _jsxDEV(Input, { id: "email", type: "email", placeholder: "name@example.com", required: true, className: "h-12" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV(Button, { type: "submit", className: "w-full h-12 text-lg", children: "Send Reset Link" }, void 0, false), /*#__PURE__*/

        _jsxDEV("div", { className: "text-center", children: /*#__PURE__*/
          _jsxDEV(Link, { href: "/login", children: /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 cursor-pointer transition-colors", children: [/*#__PURE__*/
              _jsxDEV(ArrowLeft, { className: "w-4 h-4" }, void 0, false), " Back to login"] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        )] }, void 0, true
      ) : /*#__PURE__*/

      _jsxDEV("div", { className: "text-center space-y-6 py-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6", children: /*#__PURE__*/
          _jsxDEV(CheckCircle2, { className: "w-8 h-8 text-primary" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-muted-foreground", children: "If an account exists for that email, we have sent password reset instructions." }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("div", { className: "pt-4", children: /*#__PURE__*/
          _jsxDEV(Link, { href: "/login", children: /*#__PURE__*/
            _jsxDEV(Button, { variant: "outline", className: "w-full", children: "Return to login" }, void 0, false) }, void 0, false
          ) }, void 0, false
        )] }, void 0, true
      ) }, void 0, false

    ));

}