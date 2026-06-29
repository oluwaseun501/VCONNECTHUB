import { useLocation } from "wouter";
import { AlertCircle } from "lucide-react";import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export default function NotFound() {
  const [location] = useLocation();

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex w-full flex-col items-center justify-center min-h-screen bg-background text-foreground text-center", children: [/*#__PURE__*/
      _jsxDEV(AlertCircle, { className: "w-16 h-16 text-destructive mb-4" }, void 0, false), /*#__PURE__*/
      _jsxDEV("h1", { className: "text-4xl font-bold tracking-tight mb-2", children: "404 Page Not Found" }, void 0, false), /*#__PURE__*/
      _jsxDEV("p", { className: "text-muted-foreground mb-8", children: ["Did not find route: ", /*#__PURE__*/
        _jsxDEV("code", { className: "bg-muted px-2 py-1 rounded text-sm", children: location }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("a", { href: "/", className: "px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors", children: "Return to Home" }, void 0, false

      )] }, void 0, true
    ));

}