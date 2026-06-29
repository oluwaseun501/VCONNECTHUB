import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
// We'll just build a styled toggle since Radix Switch needs proper imports or we mock it
import { User, Shield, Bell, Trash2 } from "lucide-react";import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export default function Settings() {
  return (/*#__PURE__*/
    _jsxDEV(DashboardLayout, { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "mb-8", children: [/*#__PURE__*/
        _jsxDEV("h1", { className: "text-3xl font-bold tracking-tight", children: "Settings" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-muted-foreground mt-1", children: "Manage your account preferences and security." }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [/*#__PURE__*/


        _jsxDEV("div", { className: "lg:col-span-3 space-y-1", children:
          [
          { id: 'profile', icon: User, label: 'Profile' },
          { id: 'security', icon: Shield, label: 'Security & PIN' },
          { id: 'notifications', icon: Bell, label: 'Notifications' },
          { id: 'danger', icon: Trash2, label: 'Danger Zone', danger: true }].
          map((tab) => /*#__PURE__*/
          _jsxDEV("div", {

            className: `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
            tab.id === 'profile' ?
            'bg-primary/10 text-primary font-medium' :
            tab.danger ?
            'hover:bg-destructive/10 text-destructive/80 hover:text-destructive' :
            'hover:bg-muted text-muted-foreground hover:text-foreground'}`, children: [/*#__PURE__*/


            _jsxDEV(tab.icon, { className: "w-4 h-4" }, void 0, false),
            tab.label] }, tab.id, true
          )
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "lg:col-span-9 space-y-8", children: [/*#__PURE__*/

          _jsxDEV(Card, { className: "glass-card", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-6 border-b border-border", children: /*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-lg flex items-center gap-2", children: [/*#__PURE__*/_jsxDEV(User, { className: "w-5 h-5 text-primary" }, void 0, false), " Profile Information"] }, void 0, true) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(CardContent, { className: "p-6", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-col sm:flex-row gap-8 items-start mb-8", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold text-white shadow-xl flex-shrink-0", children: "DK" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex-1 space-y-4 w-full", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                      _jsxDEV(Label, { className: "text-sm font-medium", children: "Username" }, void 0, false), /*#__PURE__*/
                      _jsxDEV(Input, { defaultValue: "darkknight99", className: "bg-background/50" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                      _jsxDEV(Label, { className: "text-sm font-medium", children: "Email Address" }, void 0, false), /*#__PURE__*/
                      _jsxDEV(Input, { defaultValue: "darkknight99@example.com", type: "email", className: "bg-background/50" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV(Button, { children: "Save Changes" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(Card, { className: "glass-card", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-6 border-b border-border", children: /*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-lg flex items-center gap-2", children: [/*#__PURE__*/_jsxDEV(Shield, { className: "w-5 h-5 text-primary" }, void 0, false), " Security & PIN"] }, void 0, true) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(CardContent, { className: "p-6 space-y-8", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "font-medium text-sm text-muted-foreground uppercase tracking-wider", children: "Change Password" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                    _jsxDEV(Label, { className: "text-sm font-medium", children: "Current Password" }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Input, { type: "password", placeholder: "••••••••", className: "bg-background/50" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                      _jsxDEV(Label, { className: "text-sm font-medium", children: "New Password" }, void 0, false), /*#__PURE__*/
                      _jsxDEV(Input, { type: "password", placeholder: "••••••••", className: "bg-background/50" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                      _jsxDEV(Label, { className: "text-sm font-medium", children: "Confirm New Password" }, void 0, false), /*#__PURE__*/
                      _jsxDEV(Input, { type: "password", placeholder: "••••••••", className: "bg-background/50" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(Button, { variant: "secondary", children: "Update Password" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "pt-6 border-t border-border space-y-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex justify-between items-start", children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("h4", { className: "font-medium text-sm text-muted-foreground uppercase tracking-wider mb-1", children: "Transaction PIN" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-muted-foreground", children: "Change your 4-digit PIN used for confirming purchases." }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV(Button, { variant: "outline", children: "Change PIN" }, void 0, false)] }, void 0, true
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(Card, { className: "glass-card", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-6 border-b border-border text-destructive", children: /*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-lg flex items-center gap-2", children: [/*#__PURE__*/_jsxDEV(Trash2, { className: "w-5 h-5" }, void 0, false), " Danger Zone"] }, void 0, true) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(CardContent, { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-muted-foreground mb-4", children: "Once you delete your account, there is no going back. All your active numbers, wallet balance, and transaction history will be permanently deleted." }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV(Button, { variant: "destructive", children: "Delete Account" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true

        )] }, void 0, true
      )] }, void 0, true
    ));

}