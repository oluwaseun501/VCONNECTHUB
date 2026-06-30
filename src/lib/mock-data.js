

export const services = [
  { id: "telegram", name: "Telegram", price: 150, icon: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg", successRate: 98 },
  { id: "whatsapp", name: "WhatsApp", price: 200, icon: "https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png", successRate: 95 },
  { id: "facebook", name: "Facebook", price: 120, icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", successRate: 97 },
  { id: "instagram", name: "Instagram", price: 120, icon: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg", successRate: 97 },
  { id: "tiktok", name: "TikTok", price: 100, icon: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg", successRate: 96 },
  { id: "twitter", name: "Twitter / X", price: 110, icon: "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg", successRate: 96 },
  { id: "discord", name: "Discord", price: 130, icon: "https://logo.clearbit.com/discord.com", successRate: 97 },
  { id: "snapchat", name: "Snapchat", price: 110, icon: "https://logo.clearbit.com/snapchat.com", successRate: 95 },
  { id: "linkedin", name: "LinkedIn", price: 140, icon: "https://logo.clearbit.com/linkedin.com", successRate: 96 },
  { id: "youtube", name: "YouTube", price: 90, icon: "https://logo.clearbit.com/youtube.com", successRate: 98 },
  { id: "pinterest", name: "Pinterest", price: 90, icon: "https://logo.clearbit.com/pinterest.com", successRate: 95 },
  { id: "spotify", name: "Spotify", price: 120, icon: "https://logo.clearbit.com/spotify.com", successRate: 96 },
  { id: "tinder", name: "Tinder", price: 160, icon: "https://logo.clearbit.com/tinder.com", successRate: 94 },
  { id: "bumble", name: "Bumble", price: 150, icon: "https://logo.clearbit.com/bumble.com", successRate: 93 },
  { id: "hinge", name: "Hinge", price: 150, icon: "https://logo.clearbit.com/hinge.co", successRate: 94 },
  { id: "signal", name: "Signal", price: 130, icon: "https://logo.clearbit.com/signal.org", successRate: 97 },
  { id: "viber", name: "Viber", price: 120, icon: "https://logo.clearbit.com/viber.com", successRate: 95 },
  { id: "reddit", name: "Reddit", price: 100, icon: "https://logo.clearbit.com/reddit.com", successRate: 96 },
  { id: "line", name: "Line", price: 110, icon: "https://logo.clearbit.com/line.me", successRate: 95 },
  { id: "wechat", name: "WeChat", price: 200, icon: "https://logo.clearbit.com/wechat.com", successRate: 92 },
  { id: "badoo", name: "Badoo", price: 140, icon: "https://logo.clearbit.com/badoo.com", successRate: 93 },
  { id: "twitter2", name: "Threads", price: 100, icon: "https://logo.clearbit.com/threads.net", successRate: 95 },
];

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