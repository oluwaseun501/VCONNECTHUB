import { cn } from '@/lib/utils';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

function Skeleton({
  className,
  ...props
}) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      className: cn('animate-pulse rounded-md bg-primary/10', className), ...
      props }, void 0, false
    ));

}

export { Skeleton };