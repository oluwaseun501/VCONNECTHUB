

export const services = [
  { id: "telegram",  name: "Telegram",   icon: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",                        successRate: 98 },
  { id: "whatsapp",  name: "WhatsApp",   icon: "https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png",                         successRate: 95 },
  { id: "facebook",  name: "Facebook",   icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",             successRate: 97 },
  { id: "instagram", name: "Instagram",  icon: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",                    successRate: 97 },
  { id: "tiktok",    name: "TikTok",     icon: "https://cdn.simpleicons.org/tiktok",                                                             successRate: 96 },
  { id: "twitter",   name: "Twitter / X",icon: "https://cdn.simpleicons.org/x/ffffff",                                                           successRate: 96 },
  { id: "discord",   name: "Discord",    icon: "https://cdn.simpleicons.org/discord",                                                            successRate: 97 },
  { id: "snapchat",  name: "Snapchat",   icon: "https://cdn.simpleicons.org/snapchat",                                                           successRate: 95 },
  { id: "linkedin",  name: "LinkedIn",   icon: "https://cdn.simpleicons.org/linkedin",                                                           successRate: 96 },
  { id: "youtube",   name: "YouTube",    icon: "https://cdn.simpleicons.org/youtube",                                                            successRate: 98 },
  { id: "pinterest", name: "Pinterest",  icon: "https://cdn.simpleicons.org/pinterest",                                                          successRate: 95 },
  { id: "spotify",   name: "Spotify",    icon: "https://cdn.simpleicons.org/spotify",                                                            successRate: 96 },
  { id: "tinder",    name: "Tinder",     icon: "https://cdn.simpleicons.org/tinder",                                                             successRate: 94 },
  { id: "bumble",    name: "Bumble",     icon: "https://cdn.simpleicons.org/bumble",                                                             successRate: 93 },
  { id: "hinge",     name: "Hinge",      icon: "https://cdn.simpleicons.org/hinge",                                                              successRate: 94 },
  { id: "signal",    name: "Signal",     icon: "https://cdn.simpleicons.org/signal",                                                             successRate: 97 },
  { id: "viber",     name: "Viber",      icon: "https://cdn.simpleicons.org/viber",                                                              successRate: 95 },
  { id: "reddit",    name: "Reddit",     icon: "https://cdn.simpleicons.org/reddit",                                                             successRate: 96 },
  { id: "line",      name: "Line",       icon: "https://cdn.simpleicons.org/line",                                                               successRate: 95 },
  { id: "wechat",    name: "WeChat",     icon: "https://cdn.simpleicons.org/wechat",                                                             successRate: 92 },
  { id: "badoo",     name: "Badoo",      icon: "https://cdn.simpleicons.org/badoo",                                                              successRate: 93 },
  { id: "twitter2",  name: "Threads",    icon: "https://cdn.simpleicons.org/threads/ffffff",                                                     successRate: 95 },
];

export const countries = [
  { id: "us", name: "United States", code: "+1", flag: "https://flagcdn.com/w40/us.png" },
  { id: "uk", name: "United Kingdom", code: "+44", flag: "https://flagcdn.com/w40/gb.png" },
  { id: "ca", name: "Canada", code: "+1", flag: "https://flagcdn.com/w40/ca.png" },
  { id: "de", name: "Germany", code: "+49", flag: "https://flagcdn.com/w40/de.png" },
  { id: "fr", name: "France", code: "+33", flag: "https://flagcdn.com/w40/fr.png" },
  { id: "in", name: "India", code: "+91", flag: "https://flagcdn.com/w40/in.png" },
  { id: "ng", name: "Nigeria", code: "+234", flag: "https://flagcdn.com/w40/ng.png" },
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