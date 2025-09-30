export const PHONE_COUNTRIES = [
  { iso2: "AZ", name: "Azerbaijan", dialCode: "+994" },
  { iso2: "US", name: "United States", dialCode: "+1" },
  { iso2: "CA", name: "Canada", dialCode: "+1" },
  { iso2: "GB", name: "United Kingdom", dialCode: "+44" },
  { iso2: "DE", name: "Germany", dialCode: "+49" },
  { iso2: "FR", name: "France", dialCode: "+33" },
  { iso2: "TR", name: "Türkiye", dialCode: "+90" },
  { iso2: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { iso2: "SA", name: "Saudi Arabia", dialCode: "+966" },
  { iso2: "KZ", name: "Kazakhstan", dialCode: "+7" },
  { iso2: "IN", name: "India", dialCode: "+91" },
  { iso2: "AU", name: "Australia", dialCode: "+61" },
  { iso2: "NZ", name: "New Zealand", dialCode: "+64" },
  { iso2: "RU", name: "Russia", dialCode: "+7" },
  { iso2: "UA", name: "Ukraine", dialCode: "+380" },
  { iso2: "GE", name: "Georgia", dialCode: "+995" },
  { iso2: "AM", name: "Armenia", dialCode: "+374" },
  // ...add the rest here (same shape)
];

export const isoToEmojiFlag = (iso2) =>
  iso2
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
