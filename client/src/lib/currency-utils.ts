// Currency options based on published countries
export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar' }, // United States, Dominica
  { code: 'EUR', symbol: '€', name: 'Euro' }, // France, Spain, European countries
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }, // Canada
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }, // Australia
  { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar' }, // Belize
  { code: 'GBP', symbol: '£', name: 'British Pound' }, // United Kingdom
] as const;

export type CurrencyCode = 'USD' | 'EUR' | 'CAD' | 'AUD' | 'BZD' | 'GBP';

// Exchange rates (ready for API integration)
// Base currency is USD (all rates are USD to X)
export const EXCHANGE_RATES: Record<string, number> = {
  // Base currencies for selection
  'USD': 1.0,
  'EUR': 0.85,
  'AUD': 1.5,
  
  // Additional currencies from Airtable data
  'AED': 3.67, // UAE Dirham
  'AFN': 72.0, // Afghan Afghani
  'ALL': 92.0, // Albanian Lek
  'AMD': 390.0, // Armenian Dram
  'AOA': 830.0, // Angolan Kwanza
  'ARS': 350.0, // Argentine Peso
  'AWG': 1.8, // Aruban Florin
  'AZN': 1.7, // Azerbaijani Manat
  'BAM': 1.66, // Bosnia-Herzegovina Convertible Mark
  'BBD': 2.0, // Barbadian Dollar
  'BDT': 110.0, // Bangladeshi Taka
  'BGN': 1.66, // Bulgarian Lev
  'BHD': 0.376, // Bahraini Dinar
  'BIF': 2850.0, // Burundian Franc
  'BMD': 1.0, // Bermudan Dollar
  'BND': 1.35, // Brunei Dollar
  'BOB': 6.9, // Bolivian Boliviano
  'BRL': 5.0, // Brazilian Real
  'BSD': 1.0, // Bahamian Dollar
  'BTN': 83.0, // Bhutanese Ngultrum
  'BYN': 3.1, // Belarusian Ruble
  'BZD': 2.0, // Belize Dollar
  'CAD': 1.35, // Canadian Dollar
  'CDF': 2100.0, // Congolese Franc
  'CHF': 0.9, // Swiss Franc
  'CLP': 800.0, // Chilean Peso
  'CNY': 7.2, // Chinese Yuan
  'COP': 4000.0, // Colombian Peso
  'CRC': 520.0, // Costa Rican Colón
  'CUP': 24.0, // Cuban Peso
  'CZK': 22.0, // Czech Koruna
  'DJF': 178.0, // Djiboutian Franc
  'DKK': 6.3, // Danish Krone
  'DOP': 57.0, // Dominican Peso
  'DZD': 135.0, // Algerian Dinar
  'EGP': 31.0, // Egyptian Pound
  'ERN': 15.0, // Eritrean Nakfa
  'ETB': 57.0, // Ethiopian Birr
  'FJD': 2.2, // Fijian Dollar
  'GBP': 0.78, // British Pound Sterling
  'GEL': 2.7, // Georgian Lari
  'GHS': 12.0, // Ghanaian Cedi
  'GIP': 0.78, // Gibraltar Pound
  'GMD': 67.0, // Gambian Dalasi
  'GNF': 8600.0, // Guinean Franc
  'GTQ': 7.8, // Guatemalan Quetzal
  'HKD': 7.8, // Hong Kong Dollar
  'HNL': 25.0, // Honduran Lempira
  'HRK': 6.4, // Croatian Kuna
  'HUF': 360.0, // Hungarian Forint
  'IDR': 15700.0, // Indonesian Rupiah
  'ILS': 3.7, // Israeli Shekel
  'INR': 83.0, // Indian Rupee
  'IQD': 1470.0, // Iraqi Dinar
  'IRR': 42000.0, // Iranian Rial
  'ISK': 138.0, // Icelandic Króna
  'JMD': 155.0, // Jamaican Dollar
  'JOD': 0.71, // Jordanian Dinar
  'JPY': 150.0, // Japanese Yen
  'KES': 147.0, // Kenyan Shilling
  'KGS': 89.0, // Kyrgystani Som
  'KHR': 4100.0, // Cambodian Riel
  'KMF': 417.0, // Comorian Franc
  'KRW': 1320.0, // South Korean Won
  'KWD': 0.31, // Kuwaiti Dinar
  'KYD': 0.83, // Cayman Islands Dollar
  'KZT': 450.0, // Kazakhstani Tenge
  'LAK': 21000.0, // Laotian Kip
  'LBP': 15000.0, // Lebanese Pound
  'LKR': 325.0, // Sri Lankan Rupee
  'LSL': 18.5, // Lesotho Loti
  'MAD': 10.0, // Moroccan Dirham
  'MDL': 17.8, // Moldovan Leu
  'MGA': 4500.0, // Malagasy Ariary
  'MKD': 52.0, // Macedonian Denar
  'MMK': 2100.0, // Myanmar Kyat
  'MNT': 3500.0, // Mongolian Tugrik
  'MOP': 8.0, // Macanese Pataca
  'MRU': 40.0, // Mauritanian Ouguiya
  'MUR': 45.0, // Mauritian Rupee
  'MVR': 15.4, // Maldivian Rufiyaa
  'MWK': 1700.0, // Malawian Kwacha
  'MXN': 17.0, // Mexican Peso
  'MYR': 4.7, // Malaysian Ringgit
  'MZN': 64.0, // Mozambican Metical
  'NAD': 18.5, // Namibian Dollar
  'NGN': 800.0, // Nigerian Naira
  'NIO': 37.0, // Nicaraguan Córdoba
  'NOK': 10.8, // Norwegian Krone
  'NPR': 133.0, // Nepalese Rupee
  'NZD': 1.6, // New Zealand Dollar
  'OMR': 0.385, // Omani Rial
  'PAB': 1.0, // Panamanian Balboa
  'PEN': 3.75, // Peruvian Nuevo Sol
  'PGK': 3.7, // Papua New Guinean Kina
  'PHP': 56.0, // Philippine Peso
  'PKR': 285.0, // Pakistani Rupee
  'PLN': 4.0, // Polish Złoty
  'PYG': 7300.0, // Paraguayan Guarani
  'QAR': 3.64, // Qatari Rial
  'RON': 4.2, // Romanian Leu
  'RSD': 99.0, // Serbian Dinar
  'RUB': 92.0, // Russian Ruble
  'RWF': 1240.0, // Rwandan Franc
  'SAR': 3.75, // Saudi Riyal
  'SCR': 13.5, // Seychellois Rupee
  'SDG': 600.0, // Sudanese Pound
  'SEK': 10.6, // Swedish Krona
  'SGD': 1.35, // Singapore Dollar
  'SHP': 0.78, // Saint Helena Pound
  'SLE': 22.0, // Sierra Leonean Leone
  'SRD': 38.0, // Surinamese Dollar
  'STN': 22.0, // São Tomé and Príncipe Dobra
  'SVC': 8.75, // Salvadoran Colón
  'SYP': 13000.0, // Syrian Pound
  'THB': 36.0, // Thai Baht
  'TJS': 11.0, // Tajikistani Somoni
  'TMT': 3.5, // Turkmenistani Manat
  'TND': 3.1, // Tunisian Dinar
  'TOP': 2.3, // Tongan Pa'anga
  'TRY': 29.0, // Turkish Lira
  'TTD': 6.8, // Trinidad and Tobago Dollar
  'TWD': 32.0, // New Taiwan Dollar
  'TZS': 2500.0, // Tanzanian Shilling
  'UAH': 37.0, // Ukrainian Hryvnia
  'UGX': 3700.0, // Ugandan Shilling
  'UYU': 39.0, // Uruguayan Peso
  'UZS': 12200.0, // Uzbekistan Som
  'VES': 36.0, // Venezuelan Bolívar
  'VND': 24500.0, // Vietnamese Dong
};

// Country-specific currency mapping based on your requirements
export const COUNTRY_CURRENCY_MAP: Record<string, { code: string; symbol: string; name: string }> = {
  // European countries - EUR
  'Germany': { code: 'EUR', symbol: '€', name: 'Euro' },
  'France': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Spain': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Italy': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Netherlands': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Belgium': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Austria': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Portugal': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Ireland': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Greece': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Finland': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Luxembourg': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Malta': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Cyprus': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Estonia': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Latvia': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Lithuania': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Slovakia': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Slovenia': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Croatia': { code: 'EUR', symbol: '€', name: 'Euro' },
  
  // Non-EU European countries
  'United Kingdom': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'UK': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'Switzerland': { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  'Norway': { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  'Sweden': { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  'Denmark': { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  'Poland': { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  'Czech Republic': { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  'Hungary': { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  'Romania': { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  'Bulgaria': { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
  'Iceland': { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna' },
  'Serbia': { code: 'RSD', symbol: 'RSD', name: 'Serbian Dinar' },
  'Bosnia and Herzegovina': { code: 'BAM', symbol: 'KM', name: 'Bosnia-Herzegovina Convertible Mark' },
  'Montenegro': { code: 'EUR', symbol: '€', name: 'Euro' },
  'North Macedonia': { code: 'MKD', symbol: 'ден', name: 'Macedonian Denar' },
  'Albania': { code: 'ALL', symbol: 'Lek', name: 'Albanian Lek' },
  'Moldova': { code: 'MDL', symbol: 'L', name: 'Moldovan Leu' },
  'Ukraine': { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  'Belarus': { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble' },
  'Russia': { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  'Turkey': { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  'Georgia': { code: 'GEL', symbol: '₾', name: 'Georgian Lari' },
  'Armenia': { code: 'AMD', symbol: '֏', name: 'Armenian Dram' },
  'Azerbaijan': { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat' },
  
  // Americas
  'United States': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'USA': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'Belize': { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar' },
  'Dominica': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'Canada': { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  'Mexico': { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  'Brazil': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  'Argentina': { code: 'ARS', symbol: 'AR$', name: 'Argentine Peso' },
  'Chile': { code: 'CLP', symbol: 'CL$', name: 'Chilean Peso' },
  'Colombia': { code: 'COP', symbol: 'CO$', name: 'Colombian Peso' },
  'Peru': { code: 'PEN', symbol: 'S/.', name: 'Peruvian Sol' },
  'Venezuela': { code: 'VES', symbol: 'Bs.S', name: 'Venezuelan Bolívar' },
  'Ecuador': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'Uruguay': { code: 'UYU', symbol: 'UY$', name: 'Uruguayan Peso' },
  'Paraguay': { code: 'PYG', symbol: '₲', name: 'Paraguayan Guarani' },
  'Bolivia': { code: 'BOB', symbol: 'Bs', name: 'Bolivian Boliviano' },
  'Guyana': { code: 'GYD', symbol: 'GY$', name: 'Guyanese Dollar' },
  'Suriname': { code: 'SRD', symbol: 'SR$', name: 'Surinamese Dollar' },
  'French Guiana': { code: 'EUR', symbol: '€', name: 'Euro' },
  'Jamaica': { code: 'JMD', symbol: 'JM$', name: 'Jamaican Dollar' },
  'Trinidad and Tobago': { code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
  'Barbados': { code: 'BBD', symbol: 'BB$', name: 'Barbadian Dollar' },
  'Bahamas': { code: 'BSD', symbol: 'BS$', name: 'Bahamian Dollar' },
  'Cuba': { code: 'CUP', symbol: 'CU$', name: 'Cuban Peso' },
  'Dominican Republic': { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso' },
  'Haiti': { code: 'HTG', symbol: 'G', name: 'Haitian Gourde' },
  'Puerto Rico': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'Costa Rica': { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón' },
  'Panama': { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa' },
  'Guatemala': { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal' },
  'Honduras': { code: 'HNL', symbol: 'L', name: 'Honduran Lempira' },
  'El Salvador': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'Nicaragua': { code: 'NIO', symbol: 'NI$', name: 'Nicaraguan Córdoba' },
  
  // Asia-Pacific
  'Australia': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  'New Zealand': { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  'Japan': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  'South Korea': { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  'China': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  'Hong Kong': { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  'Singapore': { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar' },
  'Malaysia': { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  'Thailand': { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  'Philippines': { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  'Indonesia': { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  'Vietnam': { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  'India': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  'Pakistan': { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  'Bangladesh': { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  'Sri Lanka': { code: 'LKR', symbol: 'රු', name: 'Sri Lankan Rupee' },
  'Nepal': { code: 'NPR', symbol: '₨', name: 'Nepalese Rupee' },
  'Myanmar': { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat' },
  'Cambodia': { code: 'KHR', symbol: '៛', name: 'Cambodian Riel' },
  'Laos': { code: 'LAK', symbol: '₭', name: 'Laotian Kip' },
  'Taiwan': { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
  'Macau': { code: 'MOP', symbol: 'MOP$', name: 'Macanese Pataca' },
  'Mongolia': { code: 'MNT', symbol: '₮', name: 'Mongolian Tugrik' },
  'Brunei': { code: 'BND', symbol: 'BN$', name: 'Brunei Dollar' },
  'Maldives': { code: 'MVR', symbol: 'Rf', name: 'Maldivian Rufiyaa' },
  'Fiji': { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar' },
  'Papua New Guinea': { code: 'PGK', symbol: 'K', name: 'Papua New Guinean Kina' },
  
  // Middle East & Africa
  'South Africa': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  'Egypt': { code: 'EGP', symbol: 'LE', name: 'Egyptian Pound' },
  'Morocco': { code: 'MAD', symbol: 'د.م', name: 'Moroccan Dirham' },
  'Tunisia': { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar' },
  'Algeria': { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar' },
  'Nigeria': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  'Kenya': { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  'Ghana': { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  'Ethiopia': { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  'Tanzania': { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  'Uganda': { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  'Rwanda': { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc' },
  'Zambia': { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
  'Zimbabwe': { code: 'ZWL', symbol: 'ZWL', name: 'Zimbabwean Dollar' },
  'Botswana': { code: 'BWP', symbol: 'P', name: 'Botswana Pula' },
  'Namibia': { code: 'NAD', symbol: 'NA$', name: 'Namibian Dollar' },
  'Mozambique': { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical' },
  'Madagascar': { code: 'MGA', symbol: 'Ar', name: 'Malagasy Ariary' },
  'Mauritius': { code: 'MUR', symbol: 'MURs', name: 'Mauritian Rupee' },
  'Seychelles': { code: 'SCR', symbol: 'SCRs', name: 'Seychellois Rupee' },
  'Israel': { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  'Jordan': { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar' },
  'Lebanon': { code: 'LBP', symbol: 'ل.ل', name: 'Lebanese Pound' },
  'Syria': { code: 'SYP', symbol: 'SY£', name: 'Syrian Pound' },
  'Iraq': { code: 'IQD', symbol: 'ع.د', name: 'Iraqi Dinar' },
  'Iran': { code: 'IRR', symbol: '﷼', name: 'Iranian Rial' },
  'Saudi Arabia': { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  'United Arab Emirates': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  'Qatar': { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Rial' },
  'Kuwait': { code: 'KWD', symbol: 'ك', name: 'Kuwaiti Dinar' },
  'Bahrain': { code: 'BHD', symbol: 'ب.د', name: 'Bahraini Dinar' },
  'Oman': { code: 'OMR', symbol: 'ر.ع', name: 'Omani Rial' },
  'Yemen': { code: 'YER', symbol: '﷼', name: 'Yemeni Rial' }
};

/**
 * Convert an amount from one currency to another using exchange rates
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Normalize currency codes (handle "EUR – €" format)
  const fromCode = fromCurrency.includes(' – ') ? fromCurrency.split(' – ')[0] : fromCurrency;
  const toCode = toCurrency.includes(' – ') ? toCurrency.split(' – ')[0] : toCurrency;
  
  if (fromCode === toCode) return amount;
  
  const fromRate = EXCHANGE_RATES[fromCode] || 1;
  const toRate = EXCHANGE_RATES[toCode] || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  const convertedAmount = usdAmount * toRate;
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
}

/**
 * Get currency information by country name using the mapping rules
 */
export function getCountryCurrencyByRules(countryName: string): string {
  const currencyInfo = COUNTRY_CURRENCY_MAP[countryName];
  
  if (currencyInfo) {
    return `${currencyInfo.code} – ${currencyInfo.symbol}`;
  }
  
  // Fallback to EUR for European countries not explicitly mapped
  if (isEuropeanCountry(countryName)) {
    return 'EUR – €';
  }
  
  // Fallback to USD for others
  return 'USD – $';
}

/**
 * Check if a country is in Europe (for EUR fallback)
 */
function isEuropeanCountry(countryName: string): boolean {
  const europeanCountries = [
    'Andorra', 'Monaco', 'San Marino', 'Vatican City', 'Liechtenstein',
    'Kosovo', 'Montenegro', 'North Macedonia', 'Moldova', 'Belarus',
    'Ukraine', 'Russia', 'Kazakhstan', 'Georgia', 'Armenia', 'Azerbaijan'
  ];
  return europeanCountries.includes(countryName);
}

/**
 * Format price with conversion, showing the converted amount in the selected currency
 */
export function formatPriceWithConversion(
  amount: number, 
  originalCurrency: string | undefined, 
  selectedCurrency: CurrencyCode, 
  countryName?: string
): string {
  if (!amount) return '';
  
  // Determine the original currency
  let fromCurrency = originalCurrency;
  
  // If no original currency provided, use country-based rules
  if (!fromCurrency && countryName) {
    fromCurrency = getCountryCurrencyByRules(countryName);
  }
  
  // If still no currency, fallback to EUR
  if (!fromCurrency) {
    fromCurrency = 'EUR – €';
  }
  
  // Get the symbol for the selected currency
  const selectedCurrencyInfo = CURRENCY_OPTIONS.find(c => c.code === selectedCurrency);
  const selectedSymbol = selectedCurrencyInfo?.symbol || '$';
  
  // Extract currency code from original currency format "EUR – €"
  const originalCurrencyCode = fromCurrency.includes(' – ') 
    ? fromCurrency.split(' – ')[0] 
    : fromCurrency;
  
  // Convert the amount
  const convertedAmount = convertCurrency(amount, originalCurrencyCode, selectedCurrency);
  
  // Format the amount (no decimals for whole numbers, 2 decimals for others)
  const formattedAmount = convertedAmount % 1 === 0 
    ? convertedAmount.toString() 
    : convertedAmount.toFixed(2);
  
  return `${selectedSymbol}${formattedAmount}`;
}

/**
 * Parse currency string from Airtable format "CODE – SYMBOL" to get symbol
 */
export function getCurrencySymbol(currencyString: string): string {
  if (!currencyString) return '$';
  
  if (currencyString.includes(' – ')) {
    return currencyString.split(' – ')[1];
  }
  
  // Fallback: try to find in our mapping
  const currencyCode = currencyString.toUpperCase();
  for (const [, info] of Object.entries(COUNTRY_CURRENCY_MAP)) {
    if (info.code === currencyCode) {
      return info.symbol;
    }
  }
  
  return '$'; // Ultimate fallback
}

/**
 * Get currency code from Airtable format "CODE – SYMBOL"
 */
export function getCurrencyCode(currencyString: string): string {
  if (!currencyString) return 'USD';
  
  if (currencyString.includes(' – ')) {
    return currencyString.split(' – ')[0];
  }
  
  return currencyString.toUpperCase();
}

/**
 * Check if conversion is needed (different currencies)
 */
export function needsConversion(originalCurrency: string | undefined, selectedCurrency: CurrencyCode): boolean {
  if (!originalCurrency) return true;
  
  const originalCode = getCurrencyCode(originalCurrency);
  return originalCode !== selectedCurrency;
}

/**
 * Convert budget range values with smart rounding
 */
export function convertBudgetRange(
  minValue: number, 
  maxValue: number, 
  selectedCurrency: CurrencyCode
): { min: number; max: number } {
  if (selectedCurrency === 'EUR') {
    return { min: minValue, max: maxValue };
  }

  const convertedMin = convertCurrency(minValue, 'EUR', selectedCurrency);
  const convertedMax = convertCurrency(maxValue, 'EUR', selectedCurrency);

  // Round to nice numbers based on currency
  const roundToNiceNumber = (value: number, currency: CurrencyCode): number => {
    if (currency === 'USD' || currency === 'CAD' || currency === 'AUD') {
      return Math.round(value / 10) * 10;
    } else if (currency === 'BZD') {
      return Math.round(value / 5) * 5;
    } else if (currency === 'GBP') {
      return Math.round(value / 5) * 5;
    } else {
      return Math.round(value / 5) * 5;
    }
  };

  return {
    min: roundToNiceNumber(convertedMin, selectedCurrency),
    max: roundToNiceNumber(convertedMax, selectedCurrency)
  };
}

/**
 * Get currency for a specific country (auto-selection)
 */
export function getCurrencyForCountry(countryName: string): CurrencyCode {
  if (!countryName) return 'EUR';
  
  const country = countryName.toLowerCase();
  
  // European countries
  if (['france', 'spain', 'italy', 'portugal', 'greece', 'germany', 'netherlands', 'belgium', 'austria', 'ireland', 'finland', 'luxembourg', 'malta', 'cyprus', 'estonia', 'latvia', 'lithuania', 'slovakia', 'slovenia', 'croatia'].includes(country)) {
    return 'EUR';
  }
  
  // United States and territories using USD
  if (['united states', 'usa', 'us', 'dominica'].includes(country)) {
    return 'USD';
  }
  
  // Canada
  if (['canada'].includes(country)) {
    return 'CAD';
  }
  
  // Australia
  if (['australia'].includes(country)) {
    return 'AUD';
  }
  
  // Belize
  if (['belize'].includes(country)) {
    return 'BZD';
  }
  
  // United Kingdom
  if (['united kingdom', 'uk', 'britain', 'england', 'scotland', 'wales'].includes(country)) {
    return 'GBP';
  }
  
  // Default to EUR for other European or unknown countries
  return 'EUR';
}
