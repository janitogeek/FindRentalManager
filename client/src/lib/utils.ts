import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single string using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a country name to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}

/**
 * Creates a unique slug by appending numbers for duplicates
 * @param text - The text to slugify
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function createUniqueSlug(text: string, existingSlugs: string[]): string {
  let slug = slugify(text);
  let counter = 2;
  let uniqueSlug = slug;
  
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}

/**
 * Converts a country code to a flag emoji
 */
export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Gets flag emoji for a country name
 */
export function getFlagByCountryName(countryName: string): string {
  const countryMap: { [key: string]: string } = {
    // Major countries with common variations
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'UK': '🇬🇧',
    
    // Africa
    'Angola': '🇦🇴',
    'Burkina Faso': '🇧🇫',
    'Burundi': '🇧🇮',
    'Benin': '🇧🇯',
    'Botswana': '🇧🇼',
    'Central African Republic': '🇨🇫',
    'Congo': '🇨🇬',
    'Ivory Coast': '🇨🇮',
    'Cameroon': '🇨🇲',
    'Cape Verde': '🇨🇻',
    'Djibouti': '🇩🇯',
    'Algeria': '🇩🇿',
    'Egypt': '🇪🇬',
    'Western Sahara': '🇪🇭',
    'Eritrea': '🇪🇷',
    'Ethiopia': '🇪🇹',
    'Gabon': '🇬🇦',
    'Ghana': '🇬🇭',
    'Gambia': '🇬🇲',
    'Guinea': '🇬🇳',
    'Equatorial Guinea': '🇬🇶',
    'Guinea-Bissau': '🇬🇼',
    'Kenya': '🇰🇪',
    'Comoros': '🇰🇲',
    'Liberia': '🇱🇷',
    'Lesotho': '🇱🇸',
    'Libya': '🇱🇾',
    'Morocco': '🇲🇦',
    'Madagascar': '🇲🇬',
    'Mali': '🇲🇱',
    'Mauritania': '🇲🇷',
    'Mauritius': '🇲🇺',
    'Malawi': '🇲🇼',
    'Mozambique': '🇲🇿',
    'Namibia': '🇳🇦',
    'Niger': '🇳🇪',
    'Nigeria': '🇳🇬',
    'Rwanda': '🇷🇼',
    'Seychelles': '🇸🇨',
    'Sudan': '🇸🇩',
    'Sierra Leone': '🇸🇱',
    'Senegal': '🇸🇳',
    'Somalia': '🇸🇴',
    'South Sudan': '🇸🇸',
    'Eswatini': '🇸🇿',
    'Chad': '🇹🇩',
    'Togo': '🇹🇬',
    'Tunisia': '🇹🇳',
    'Tanzania': '🇹🇿',
    'Uganda': '🇺🇬',
    'South Africa': '🇿🇦',
    'Zambia': '🇿🇲',
    'Zimbabwe': '🇿🇼',
    
    // Americas
    'Antigua and Barbuda': '🇦🇬',
    'Anguilla': '🇦🇮',
    'Argentina': '🇦🇷',
    'Aruba': '🇦🇼',
    'Barbados': '🇧🇧',
    'Saint Barthelemy': '🇧🇱',
    'Bermuda': '🇧🇲',
    'Bolivia': '🇧🇴',
    'Brazil': '🇧🇷',
    'Bahamas': '🇧🇸',
    'Belize': '🇧🇿',
    'Canada': '🇨🇦',
    'Chile': '🇨🇱',
    'Colombia': '🇨🇴',
    'Costa Rica': '🇨🇷',
    'Cuba': '🇨🇺',
    'Curacao': '🇨🇼',
    'Dominica': '🇩🇲',
    'Dominican Republic': '🇩🇴',
    'Ecuador': '🇪🇨',
    'Falkland Islands': '🇫🇰',
    'Grenada': '🇬🇩',
    'French Guiana': '🇬🇫',
    'Guadeloupe': '🇬🇵',
    'Guatemala': '🇬🇹',
    'Guyana': '🇬🇾',
    'Honduras': '🇭🇳',
    'Haiti': '🇭🇹',
    'Jamaica': '🇯🇲',
    'Saint Kitts and Nevis': '🇰🇳',
    'Cayman Islands': '🇰🇾',
    'Saint Lucia': '🇱🇨',
    'Saint Martin': '🇲🇫',
    'Martinique': '🇲🇶',
    'Montserrat': '🇲🇸',
    'Mexico': '🇲🇽',
    'Nicaragua': '🇳🇮',
    'Panama': '🇵🇦',
    'Peru': '🇵🇪',
    'Saint Pierre and Miquelon': '🇵🇲',
    'Puerto Rico': '🇵🇷',
    'Paraguay': '🇵🇾',
    'Suriname': '🇸🇷',
    'El Salvador': '🇸🇻',
    'Sint Maarten': '🇸🇽',
    'Turks and Caicos Islands': '🇹🇨',
    'Trinidad and Tobago': '🇹🇹',
    'Uruguay': '🇺🇾',
    'Venezuela': '🇻🇪',
    'British Virgin Islands': '🇻🇬',
    'US Virgin Islands': '🇻🇮',
    
    // Asia
    'United Arab Emirates': '🇦🇪',
    'Afghanistan': '🇦🇫',
    'Azerbaijan': '🇦🇿',
    'Bangladesh': '🇧🇩',
    'Bahrain': '🇧🇭',
    'Brunei': '🇧🇳',
    'Bhutan': '🇧🇹',
    'China': '🇨🇳',
    'Hong Kong': '🇭🇰',
    'Indonesia': '🇮🇩',
    'Israel': '🇮🇱',
    'India': '🇮🇳',
    'Iraq': '🇮🇶',
    'Iran': '🇮🇷',
    'Jordan': '🇯🇴',
    'Japan': '🇯🇵',
    'Kyrgyzstan': '🇰🇬',
    'Cambodia': '🇰🇭',
    'North Korea': '🇰🇵',
    'South Korea': '🇰🇷',
    'Kuwait': '🇰🇼',
    'Kazakhstan': '🇰🇿',
    'Laos': '🇱🇦',
    'Lebanon': '🇱🇧',
    'Sri Lanka': '🇱🇰',
    'Myanmar': '🇲🇲',
    'Mongolia': '🇲🇳',
    'Macau': '🇲🇴',
    'Maldives': '🇲🇻',
    'Malaysia': '🇲🇾',
    'Nepal': '🇳🇵',
    'Oman': '🇴🇲',
    'Philippines': '🇵🇭',
    'Pakistan': '🇵🇰',
    'Palestine': '🇵🇸',
    'Qatar': '🇶🇦',
    'Russia': '🇷🇺',
    'Saudi Arabia': '🇸🇦',
    'Singapore': '🇸🇬',
    'Syria': '🇸🇾',
    'Thailand': '🇹🇭',
    'Tajikistan': '🇹🇯',
    'Timor-Leste': '🇹🇱',
    'Turkmenistan': '🇹🇲',
    'Turkey': '🇹🇷',
    'Taiwan': '🇹🇼',
    'Uzbekistan': '🇺🇿',
    'Vietnam': '🇻🇳',
    'Yemen': '🇾🇪',
    
    // Europe
    'Andorra': '🇦🇩',
    'Albania': '🇦🇱',
    'Armenia': '🇦🇲',
    'Austria': '🇦🇹',
    'Bosnia and Herzegovina': '🇧🇦',
    'Belgium': '🇧🇪',
    'Bulgaria': '🇧🇬',
    'Belarus': '🇧🇾',
    'Switzerland': '🇨🇭',
    'Czech Republic': '🇨🇿',
    'Cyprus': '🇨🇾',
    'Germany': '🇩🇪',
    'Denmark': '🇩🇰',
    'Spain': '🇪🇸',
    'Estonia': '🇪🇪',
    'Finland': '🇫🇮',
    'France': '🇫🇷',
    'Georgia': '🇬🇪',
    'Guernsey': '🇬🇬',
    'Gibraltar': '🇬🇮',
    'Greece': '🇬🇷',
    'Croatia': '🇭🇷',
    'Hungary': '🇭🇺',
    'Ireland': '🇮🇪',
    'Isle of Man': '🇮🇲',
    'Iceland': '🇮🇸',
    'Italy': '🇮🇹',
    'Jersey': '🇯🇪',
    'Liechtenstein': '🇱🇮',
    'Lithuania': '🇱🇹',
    'Luxembourg': '🇱🇺',
    'Latvia': '🇱🇻',
    'Monaco': '🇲🇨',
    'Moldova': '🇲🇩',
    'Montenegro': '🇲🇪',
    'North Macedonia': '🇲🇰',
    'Malta': '🇲🇹',
    'Netherlands': '🇳🇱',
    'Norway': '🇳🇴',
    'Poland': '🇵🇱',
    'Portugal': '🇵🇹',
    'Romania': '🇷🇴',
    'Serbia': '🇷🇸',
    'Sweden': '🇸🇪',
    'Ukraine': '🇺🇦',
    'Vatican City': '🇻🇦',
    'Kosovo': '🇽🇰',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    
    // Oceania and Territories
    'Ascension Island': '🇦🇨',
    'Antarctica': '🇦🇶',
    'American Samoa': '🇦🇸',
    'Australia': '🇦🇺',
    'Christmas Island': '🇦🇽',
    'Bouvet Island': '🇧🇻',
    'Cocos Islands': '🇨🇨',
    'Cook Islands': '🇨🇰',
    'Clipperton Island': '🇨🇵',
    'Easter Island': '🇨🇽',
    'Fiji': '🇫🇯',
    'Micronesia': '🇫🇲',
    'Greenland': '🇬🇱',
    'South Georgia': '🇬🇸',
    'Guam': '🇬🇺',
    'Heard and McDonald Islands': '🇭🇲',
    'Canary Islands': '🇮🇨',
    'British Indian Ocean Territory': '🇮🇴',
    'Kiribati': '🇰🇮',
    'Marshall Islands': '🇲🇭',
    'Northern Mariana Islands': '🇲🇵',
    'New Caledonia': '🇳🇨',
    'Norfolk Island': '🇳🇫',
    'Nauru': '🇳🇷',
    'Niue': '🇳🇺',
    'New Zealand': '🇳🇿',
    'French Polynesia': '🇵🇫',
    'Papua New Guinea': '🇵🇬',
    'Pitcairn Islands': '🇵🇳',
    'Palau': '🇵🇼',
    'Reunion': '🇷🇪',
    'Solomon Islands': '🇸🇧',
    'Saint Helena': '🇸🇭',
    'Svalbard': '🇸🇯',
    'Sao Tome and Principe': '🇸🇹',
    'French Southern Territories': '🇹🇫',
    'Tokelau': '🇹🇰',
    'Tonga': '🇹🇴',
    'Tuvalu': '🇹🇻',
    'United States Minor Outlying Islands': '🇺🇲',
    'Vanuatu': '🇻🇨',
    'Wallis and Futuna': '🇼🇫',
    'Samoa': '🇼🇸',
    'Mayotte': '🇾🇹'
  };
  return countryMap[countryName] || '🌍';
}

/**
 * Format a date to a readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format a number with commas for thousands
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a URL-friendly slug from a brand name
 */
export function generateSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
}

/**
 * Generate a unique slug for a company name by checking for duplicates
 * If a company with the same name exists, adds -2, -3, etc.
 */
export function generateUniqueCompanySlug(brandName: string, existingBrandNames: string[]): string {
  // Generate base slug
  let baseSlug = generateSlug(brandName);
  let uniqueSlug = baseSlug;
  let counter = 2;
  
  // Check if slug already exists and add number suffix if needed
  while (existingBrandNames.some((name: string) => generateSlug(name) === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  console.log(`Generated unique slug for "${brandName}": ${uniqueSlug}`);
  return uniqueSlug;
}

/**
 * Check if a string is an Airtable record ID
 */
export function isAirtableId(str: string): boolean {
  return str.startsWith('rec') && str.length === 17;
}

/**
 * Extract just the city name from "City, Region, Country" format
 * Used for displaying city names in the frontend while keeping full data in backend
 */
export function extractCityName(fullCityString: string): string {
  if (!fullCityString) return '';
  
  const parts = fullCityString.split(', ');
  if (parts.length >= 1) {
    return parts[0].trim(); // First part is the city name
  }
  
  return fullCityString.trim(); // Fallback to original string if parsing fails
}

/**
 * Extract just the country name from "City, Region, Country" format
 * Used for backend logic while keeping full data in database
 */
export function extractCountryName(fullCityString: string): string {
  if (!fullCityString) return '';
  
  const parts = fullCityString.split(', ');
  if (parts.length >= 3) {
    return parts[2].trim(); // Last part is the country name
  }
  
  return ''; // Return empty if no country found
}
