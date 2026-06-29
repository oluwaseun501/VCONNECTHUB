import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { services, countries, mockTransactions } from "@/lib/mock-data";
import { Check, ChevronRight, Search, ShieldCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import { Link } from "wouter";

export default function Dashboard() {
  const [step, setStep] = useState(1);
  const [searchCountry, setSearchCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [pin, setPin] = useState(["", "", "", ""]);


  const filteredCountries = countries.filter((c) => c.name.toLowerCase().includes(searchCountry.toLowerCase()));

  const handlePinChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto advance focus
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const submitOrder = () => {
    setStep(4); // loading
    setTimeout(() => {
      setStep(5); // success
    }, 3000);
  };

  {!localStorage.getItem("txn_pin") && (
  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-sm mb-4">
    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
      <span className="text-base">🔐</span>
      <span>Haven't set your PIN yet?</span>
    </div>
    <Link href="/set-pin">
      <span className="text-violet-600 dark:text-violet-400 font-semibold hover:underline cursor-pointer">
        Set it now →
      </span>
    </Link>
  </div>
)}

  return (/*#__PURE__*/
    _jsxDEV(DashboardLayout, { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4", children: /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-3xl font-bold tracking-tight", children: "Dashboard" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-muted-foreground mt-1", children: "Get an instant number for verification." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [/*#__PURE__*/
        _jsxDEV(Card, { className: "glass-card", children: /*#__PURE__*/
          _jsxDEV(CardContent, { className: "p-6", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "text-muted-foreground text-sm font-medium mb-2", children: "Available Balance" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-3xl font-bold text-foreground", children: "₦42.50" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "mt-4", children: /*#__PURE__*/
              _jsxDEV(Button, { size: "sm", variant: "secondary", className: "w-full", onClick: () => window.location.href = '/wallet', children: "Fund Wallet" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(Card, { className: "glass-card", children: /*#__PURE__*/
          _jsxDEV(CardContent, { className: "p-6", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "text-muted-foreground text-sm font-medium mb-2", children: "Active Numbers" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-3xl font-bold text-foreground", children: "3" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "mt-4 text-sm text-yellow-500 flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "w-2 h-2 rounded-full bg-yellow-500 animate-pulse" }, void 0, false), "Expiring in ~15 mins"] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(Card, { className: "glass-card", children: /*#__PURE__*/
          _jsxDEV(CardContent, { className: "p-6", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "text-muted-foreground text-sm font-medium mb-2", children: "Total OTPs Received" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-3xl font-bold text-foreground", children: "128" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "mt-4 text-sm text-emerald-500 flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(ShieldCheck, { className: "w-4 h-4" }, void 0, false), " 96% success rate"] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "lg:col-span-7", children: /*#__PURE__*/
          _jsxDEV(Card, { className: "glass-card h-full border-primary/20 relative overflow-hidden", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-primary" }, void 0, false), /*#__PURE__*/
            _jsxDEV(CardContent, { className: "p-0", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex border-b border-border", children:
                [1, 2, 3].map((s) => /*#__PURE__*/
                _jsxDEV("div", { className: `flex-1 py-4 text-center text-sm font-medium transition-colors ${step >= s ? 'text-primary' : 'text-muted-foreground'}`, children:
                  s === 1 ? '1. Country' : s === 2 ? '2. Service' : '3. Pay & Get OTP' }, s, false
                )
                ) }, void 0, false
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "p-6", children: [

                step === 1 && /*#__PURE__*/
                _jsxDEV("div", { className: "animate-in fade-in slide-in-from-right-4 duration-300", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "relative mb-6", children: [/*#__PURE__*/
                    _jsxDEV(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Input, {
                      placeholder: "Search countries...",
                      className: "pl-10 h-12 bg-background/50",
                      value: searchCountry,
                      onChange: (e) => setSearchCountry(e.target.value) }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar", children:
                    filteredCountries.map((country) => /*#__PURE__*/
                    _jsxDEV("div", {

                      onClick: () => {setSelectedCountry(country);setStep(2);},
                      className: `flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedCountry?.id === country.id ?
                      'border-primary bg-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' :
                      'border-border bg-background/30 hover:border-primary/50'}`, children: [/*#__PURE__*/


                      _jsxDEV("img", { src: country.flag, alt: country.name, className: "w-6 h-auto mr-3 rounded-sm shadow-sm" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "font-medium text-sm", children: country.name }, void 0, false), /*#__PURE__*/
                        _jsxDEV("div", { className: "text-xs text-muted-foreground", children: country.code }, void 0, false)] }, void 0, true
                      )] }, country.id, true
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ),



                step === 2 && /*#__PURE__*/
                _jsxDEV("div", { className: "animate-in fade-in slide-in-from-right-4 duration-300", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2 mb-6", children: [/*#__PURE__*/
                    _jsxDEV(Button, { variant: "ghost", size: "sm", onClick: () => setStep(1), className: "px-2 h-8", children: "Back to Countries" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex-1" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { className: "text-sm font-medium flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full", children: [/*#__PURE__*/
                      _jsxDEV("img", { src: selectedCountry.flag, alt: "", className: "w-4" }, void 0, false), " ", selectedCountry.name] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar", children:
                    services.map((service) => /*#__PURE__*/
                    _jsxDEV("div", {

                      onClick: () => {setSelectedService(service);setStep(3);},
                      className: "flex flex-col items-center p-4 rounded-xl border border-border bg-background/30 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-center group", children: [/*#__PURE__*/

                      _jsxDEV("div", { className: "w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", children: /*#__PURE__*/
                        _jsxDEV("img", { src: service.icon, alt: service.name, className: "w-6 h-6 object-contain" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "font-medium text-sm", children: service.name }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-primary font-bold mt-1", children: ["₦", service.price] }, void 0, true), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-[10px] text-muted-foreground mt-2 bg-background px-2 py-0.5 rounded-full", children: [
                        service.successRate, "% Success"] }, void 0, true
                      )] }, service.id, true
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ),



                step === 3 && /*#__PURE__*/
                _jsxDEV("div", { className: "animate-in fade-in slide-in-from-right-4 duration-300", children: [/*#__PURE__*/
                  _jsxDEV(Button, { variant: "ghost", size: "sm", onClick: () => setStep(2), className: "px-2 h-8 mb-4", children: "Back to Services" }, void 0, false

                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "bg-card/50 border border-border rounded-xl p-5 mb-6", children: [/*#__PURE__*/
                    _jsxDEV("h3", { className: "font-semibold mb-4 border-b border-border pb-3", children: "Order Summary" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex justify-between items-center mb-3", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center text-sm text-muted-foreground", children: [/*#__PURE__*/
                        _jsxDEV("img", { src: selectedCountry.flag, alt: "", className: "w-4 mr-2" }, void 0, false), " Country"] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "font-medium", children: selectedCountry.name }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex justify-between items-center mb-3", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "text-sm text-muted-foreground", children: "Service" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center font-medium", children: [/*#__PURE__*/
                        _jsxDEV("img", { src: selectedService.icon, alt: "", className: "w-4 mr-2" }, void 0, false), " ", selectedService.name] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex justify-between items-center pt-3 border-t border-border mt-3", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "text-sm font-medium", children: "Total Cost" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-xl font-bold text-primary", children: ["₦", selectedService.price] }, void 0, true)] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "text-center mb-6", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-muted-foreground mb-4", children: "Enter your 4-digit PIN to confirm purchase" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex justify-center gap-3", children:
                      [0, 1, 2, 3].map((i) => /*#__PURE__*/
                      _jsxDEV("input", {

                        id: `pin-${i}`,
                        type: "password",
                        maxLength: 1,
                        value: pin[i],
                        onChange: (e) => handlePinChange(i, e.target.value),
                        className: "w-14 h-16 text-center text-2xl font-bold rounded-xl border border-input bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" }, i, false
                      )
                      ) }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV(Button, {
                    className: "w-full h-12 text-lg",
                    onClick: submitOrder,
                    disabled: pin.join('').length < 4, children:
                    "Pay & Get Number" }, void 0, false

                  )] }, void 0, true
                ),



                step === 4 && /*#__PURE__*/
                _jsxDEV("div", { className: "py-12 flex flex-col items-center justify-center animate-in fade-in duration-300", children: [/*#__PURE__*/
                  _jsxDEV(Loader2, { className: "w-12 h-12 text-primary animate-spin mb-6" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-xl font-semibold mb-2", children: "Awaiting SMS..." }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-muted-foreground text-center max-w-sm", children: ["We've generated your number. Please send the SMS from ",
                    selectedService.name, "."] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "mt-8 p-4 bg-muted/30 rounded-xl border border-border w-full max-w-xs text-center", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-wider", children: "Your Number" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { className: "text-2xl font-mono tracking-widest text-foreground", children: [
                      selectedCountry.code, " 801 445 9291"] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ),



                step === 5 && /*#__PURE__*/
                _jsxDEV("div", { className: "py-8 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6", children: /*#__PURE__*/
                    _jsxDEV(Check, { className: "w-8 h-8 text-primary" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-2xl font-bold mb-2", children: "OTP Received!" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-muted-foreground mb-8", children: "Your verification code is ready." }, void 0, false), /*#__PURE__*/

                  _jsxDEV("div", { className: "bg-primary/10 border-2 border-primary border-dashed rounded-2xl p-8 w-full max-w-sm text-center relative overflow-hidden", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "absolute inset-0 bg-primary/5" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { className: "relative z-10", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "text-sm font-medium text-primary mb-2 uppercase tracking-widest", children: "Verification Code" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-5xl font-mono font-bold tracking-[0.2em] text-foreground drop-shadow-md", children: "G-49201" }, void 0, false

                      )] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV(Button, {
                    variant: "outline",
                    className: "mt-8 h-12 px-8",
                    onClick: () => {setStep(1);setPin(['', '', '', '']);}, children:
                    "Buy Another Number" }, void 0, false

                  )] }, void 0, true
                )] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "lg:col-span-5", children: /*#__PURE__*/
          _jsxDEV(Card, { className: "glass-card h-full flex flex-col", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-6 border-b border-border flex justify-between items-center", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-lg", children: "Recent Activity" }, void 0, false), /*#__PURE__*/
              _jsxDEV(Button, { variant: "ghost", size: "sm", className: "text-xs h-8", onClick: () => window.location.href = '/wallet', children: "View All" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex-1 p-0 overflow-y-auto", children:
              mockTransactions.map((tx, i) => /*#__PURE__*/
              _jsxDEV("div", { className: `p-4 flex items-center justify-between border-b border-border hover:bg-white/5 transition-colors ${i === mockTransactions.length - 1 ? 'border-b-0' : ''}`, children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'Credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`, children:
                    tx.type === 'Credit' ? /*#__PURE__*/_jsxDEV(ShieldCheck, { className: "w-5 h-5" }, void 0, false) : /*#__PURE__*/_jsxDEV(ChevronRight, { className: "w-5 h-5" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "font-medium text-sm", children: tx.description }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { className: "text-xs text-muted-foreground", children: [
                      new Date(tx.date).toLocaleDateString(), " • ", tx.status] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: `font-bold ${tx.type === 'Credit' ? 'text-emerald-500' : ''}`, children: [
                  tx.type === 'Credit' ? '+' : '-', "₦", tx.amount] }, void 0, true
                )] }, tx.id, true
              )
              ) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true
    ));

}