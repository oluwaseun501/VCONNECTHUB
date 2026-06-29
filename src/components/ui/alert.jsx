import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
        'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const Alert = /*#__PURE__*/React.forwardRef(


  ({ className, variant, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", {
    ref: ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className), ...
    props }, void 0, false
  )
);
Alert.displayName = 'Alert';

const AlertTitle = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("h5", {
    ref: ref,
    className: cn('mb-1 font-medium leading-none tracking-tight', className), ...
    props }, void 0, false
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = /*#__PURE__*/React.forwardRef(


  ({ className, ...props }, ref) => /*#__PURE__*/
  _jsxDEV("div", {
    ref: ref,
    className: cn('text-sm [&_p]:leading-relaxed', className), ...
    props }, void 0, false
  )
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };