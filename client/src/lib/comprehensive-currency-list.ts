export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

/**
 * Comprehensive currency list based on user's complete Airtable options
 * Extracted from all screenshots provided
 */
export const COMPREHENSIVE_CURRENCY_LIST: CurrencyOption[] = [
  // A
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'AFN', symbol: '؋', name: 'Afghan Afghani' },
  { code: 'ALL', symbol: 'Lek', name: 'Albanian Lek' },
  { code: 'AMD', symbol: '֏', name: 'Armenian Dram' },
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
  { code: 'ARS', symbol: 'AR$', name: 'Argentine Peso' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar' },
  { code: 'AWG', symbol: 'AWƒ', name: 'Aruban Florin' },
  { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat' },
  
  // B
  { code: 'BAM', symbol: 'KM', name: 'Bosnia and Herzegovina Convertible Mark' },
  { code: 'BBD', symbol: 'BB$', name: 'Barbadian Dollar' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
  { code: 'BHD', symbol: 'ب.د', name: 'Bahraini Dinar' },
  { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc' },
  { code: 'BMD', symbol: 'BM$', name: 'Bermudian Dollar' },
  { code: 'BND', symbol: 'BN$', name: 'Brunei Dollar' },
  { code: 'BOB', symbol: 'Bs', name: 'Bolivian Boliviano' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'BSD', symbol: 'BS$', name: 'Bahamian Dollar' },
  { code: 'BTN', symbol: 'Nu', name: 'Bhutanese Ngultrum' },
  { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar' },
  { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble' },
  
  // C
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'CDF', symbol: 'FCF', name: 'Congolese Franc' },
  { code: 'CHF', symbol: 'CHFr', name: 'Swiss Franc' },
  { code: 'CLP', symbol: 'CL$', name: 'Chilean Peso' },
  { code: 'CNY', symbol: 'CN¥', name: 'Chinese Yuan' },
  { code: 'COP', symbol: 'CO$', name: 'Colombian Peso' },
  { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón' },
  { code: 'CUP', symbol: 'CU$', name: 'Cuban Peso' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  
  // D
  { code: 'DJF', symbol: 'Fdj', name: 'Djiboutian Franc' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso' },
  { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar' },
  
  // E
  { code: 'EGP', symbol: 'LE', name: 'Egyptian Pound' },
  { code: 'ERN', symbol: 'Nkf', name: 'Eritrean Nakfa' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  
  // F
  { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar' },
  
  // G
  { code: 'GBP', symbol: '£', name: 'British Pound Sterling' },
  { code: 'GEL', symbol: '₾', name: 'Georgian Lari' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'GIP', symbol: 'GI£', name: 'Gibraltar Pound' },
  { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi' },
  { code: 'GNF', symbol: 'FG', name: 'Guinean Franc' },
  { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal' },
  
  // H
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'HNL', symbol: 'L', name: 'Honduran Lempira' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  
  // I
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'IQD', symbol: 'د.ع', name: 'Iraqi Dinar' },
  { code: 'IRR', symbol: 'ریال', name: 'Iranian Rial' },
  { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna' },
  
  // J
  { code: 'JMD', symbol: 'JM$', name: 'Jamaican Dollar' },
  { code: 'JOD', symbol: 'ا.د', name: 'Jordanian Dinar' },
  { code: 'JPY', symbol: 'JP¥', name: 'Japanese Yen' },
  
  // K
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'KGS', symbol: 'c', name: 'Kyrgyzstani Som' },
  { code: 'KHR', symbol: '៛', name: 'Cambodian Riel' },
  { code: 'KMF', symbol: 'FC', name: 'Comorian Franc' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'KWD', symbol: 'ك', name: 'Kuwaiti Dinar' },
  { code: 'KYD', symbol: 'KY$', name: 'Cayman Islands Dollar' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge' },
  
  // L
  { code: 'LAK', symbol: '₭', name: 'Lao Kip' },
  { code: 'LBP', symbol: 'J.J', name: 'Lebanese Pound' },
  { code: 'LKR', symbol: '৵', name: 'Sri Lankan Rupee' },
  { code: 'LSL', symbol: 'L', name: 'Lesotho Loti' },
  
  // M
  { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
  { code: 'MDL', symbol: 'L', name: 'Moldovan Leu' },
  { code: 'MGA', symbol: 'Ar', name: 'Malagasy Ariary' },
  { code: 'MKD', symbol: 'ден', name: 'Macedonian Denar' },
  { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat' },
  { code: 'MNT', symbol: '₮', name: 'Mongolian Tögrög' },
  { code: 'MOP', symbol: 'MOP$', name: 'Macau Pataca' },
  { code: 'MRU', symbol: 'UM', name: 'Mauritanian Ouguiya' },
  { code: 'MUR', symbol: 'MURs', name: 'Mauritian Rupee' },
  { code: 'MVR', symbol: 'Rf', name: 'Maldivian Rufiyaa' },
  { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical' },
  
  // N
  { code: 'NAD', symbol: 'NA$', name: 'Namibian Dollar' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'NIO', symbol: 'NI$', name: 'Nicaraguan Córdoba' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'NPR', symbol: 'Rs', name: 'Nepalese Rupee' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  
  // O
  { code: 'OMR', symbol: 'ع.د', name: 'Omani Rial' },
  
  // P
  { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa' },
  { code: 'PEN', symbol: 'S/.', name: 'Peruvian Sol' },
  { code: 'PGK', symbol: 'K', name: 'Papua New Guinean Kina' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'PYG', symbol: '₲', name: 'Paraguayan Guarani' },
  
  // Q
  { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal' },
  
  // R
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'RSD', symbol: 'RSD', name: 'Serbian Dinar' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc' },
  
  // S
  { code: 'SAR', symbol: 'ريال', name: 'Saudi Riyal' },
  { code: 'SCR', symbol: 'SCRs', name: 'Seychellois Rupee' },
  { code: 'SDG', symbol: 'ج.س', name: 'Sudanese Pound' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar' },
  { code: 'SHP', symbol: 'SH£', name: 'Saint Helena Pound' },
  { code: 'SLE', symbol: 'Le', name: 'Sierra Leonean Leone' },
  { code: 'SRD', symbol: 'SR$', name: 'Surinamese Dollar' },
  { code: 'STN', symbol: 'Db', name: 'São Tomé and Príncipe Dobra' },
  { code: 'SVC', symbol: '¢', name: 'Salvadoran Colón' },
  { code: 'SYP', symbol: 'SY£', name: 'Syrian Pound' },
  
  // T
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'TJS', symbol: 'SM', name: 'Tajikistani Somoni' },
  { code: 'TMT', symbol: 'T', name: 'Turkmenistan Manat' },
  { code: 'TND', symbol: 'ت.د', name: 'Tunisian Dinar' },
  { code: 'TOP', symbol: 'T$', name: 'Tongan Paʻanga' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
  { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  
  // U
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  { code: 'USD', symbol: 'US$', name: 'United States Dollar' },
  { code: 'UYU', symbol: 'UY$', name: 'Uruguayan Peso' },
  { code: 'UZS', symbol: 'so\'m', name: 'Uzbekistani Som' },
  
  // V
  { code: 'VES', symbol: 'Bs.S', name: 'Venezuelan Bolívar Soberano' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  
  // X
  { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc' },
  { code: 'XCD', symbol: 'EC$', name: 'East Caribbean Dollar' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
  { code: 'XPF', symbol: 'CFPF', name: 'CFP Franc' },
  
  // Y
  { code: 'YER', symbol: 'ريال', name: 'Yemeni Rial' },
  
  // Z
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
];
