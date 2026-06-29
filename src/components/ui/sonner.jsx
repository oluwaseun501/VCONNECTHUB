'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";



const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme();

  return (/*#__PURE__*/
    _jsxDEV(Sonner, {
      theme: theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
          'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
          'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
        }
      }, ...
      props }, void 0, false
    ));

};

export { Toaster };