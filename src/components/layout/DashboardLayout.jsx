import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { motion } from "framer-motion";import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export function DashboardLayout({ children }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "min-h-screen bg-background text-foreground flex overflow-hidden", children: [/*#__PURE__*/
      _jsxDEV(Sidebar, {}, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "flex-1 md:ml-64 flex flex-col h-screen overflow-hidden", children: [/*#__PURE__*/
        _jsxDEV(Topbar, {}, void 0, false), /*#__PURE__*/
        _jsxDEV("main", { className: "flex-1 overflow-y-auto p-6 md:p-8 relative", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10 pointer-events-none" }, void 0, false), /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "max-w-6xl mx-auto", children:

            children }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}