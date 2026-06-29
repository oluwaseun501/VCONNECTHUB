import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

function Spinner({ className, ...props }) {
  return (/*#__PURE__*/
    _jsxDEV(Loader2Icon, {
      role: "status",
      "aria-label": "Loading",
      className: cn('size-4 animate-spin', className), ...
      props }, void 0, false
    ));

}

export { Spinner };