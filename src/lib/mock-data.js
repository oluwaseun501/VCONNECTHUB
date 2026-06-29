

export const services = [
{ id: "telegram", name: "Telegram", price: 150, icon: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg", successRate: 98 },
{ id: "whatsapp", name: "WhatsApp", price: 200, icon: "https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png", successRate: 95 },
{ id: "gmail", name: "Gmail", price: 80, icon: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg", successRate: 99 },
{ id: "facebook", name: "Facebook", price: 120, icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", successRate: 97 },
{ id: "tiktok", name: "TikTok", price: 100, icon: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg", successRate: 96 },
{ id: "instagram", name: "Instagram", price: 120, icon: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", successRate: 97 },
{ id: "binance", name: "Binance", price: 250, icon: "https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg", successRate: 94 },
{ id: "twitter", name: "Twitter / X", price: 110, icon: "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg", successRate: 96 }];


export const countries = [
{ id: "ng", name: "Nigeria", code: "+234", flag: "https://flagcdn.com/w40/ng.png" },
{ id: "us", name: "United States", code: "+1", flag: "https://flagcdn.com/w40/us.png" },
{ id: "uk", name: "United Kingdom", code: "+44", flag: "https://flagcdn.com/w40/gb.png" },
{ id: "ca", name: "Canada", code: "+1", flag: "https://flagcdn.com/w40/ca.png" },
{ id: "de", name: "Germany", code: "+49", flag: "https://flagcdn.com/w40/de.png" },
{ id: "fr", name: "France", code: "+33", flag: "https://flagcdn.com/w40/fr.png" },
{ id: "in", name: "India", code: "+91", flag: "https://flagcdn.com/w40/in.png" },
{ id: "gh", name: "Ghana", code: "+233", flag: "https://flagcdn.com/w40/gh.png" }];


export const mockTransactions = [
{ id: "tx1", date: "2023-11-20T10:30:00Z", description: "Wallet Funding via Paystack", amount: 5000, type: "Credit", status: "Completed" },
{ id: "tx2", date: "2023-11-21T14:15:00Z", description: "WhatsApp Number (US)", amount: 200, type: "Debit", status: "Completed" },
{ id: "tx3", date: "2023-11-22T09:00:00Z", description: "Telegram Number (NG)", amount: 150, type: "Debit", status: "Completed" },
{ id: "tx4", date: "2023-11-23T16:45:00Z", description: "Refund: Gmail Number (CA)", amount: 80, type: "Credit", status: "Completed" }];


export const mockNumbers = [
{ id: "num1", serviceId: "whatsapp", countryId: "us", number: "+1 (555) 123-4567", otp: "482019", price: 200, status: "Completed", date: "2023-11-21T14:15:00Z" },
{ id: "num2", serviceId: "telegram", countryId: "ng", number: "+234 801 234 5678", otp: "19234", price: 150, status: "Completed", date: "2023-11-22T09:00:00Z" },
{ id: "num3", serviceId: "gmail", countryId: "ca", number: "+1 416 555 0198", otp: null, price: 80, status: "Refunded", date: "2023-11-23T16:45:00Z" },
{ id: "num4", serviceId: "facebook", countryId: "uk", number: "+44 7700 900077", otp: null, price: 120, status: "Expired", date: "2023-11-20T11:00:00Z" }];