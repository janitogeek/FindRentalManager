import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CountryMultiSelect } from "../components/country-multi-select";
import { FileDrop } from "../components/file-drop";
import { CityRegionAsyncMultiSelect } from "../components/city-region-async-multi-select";
import { SimpleMultiSelect } from "../components/simple-multi-select";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { CheckboxGroup } from "../components/checkbox-group";
import { SearchableMultiSelect } from "../components/searchable-multi-select";
import { airtableService } from "@/lib/airtable";
import { createCheckoutSession } from "@/lib/stripe";
import { useMemo, useEffect } from "react";

const planEnum = z.enum(["Basic (€99.99/year)", "Premium (€499.99/year)"]);
const formSchema = z.object({
  "Brand Name": z.string().min(2),
  "PMC General Website": z.string().url("Please enter a valid URL"),
  "Direct Booking Engine URL": z.string().url("Please enter a valid URL"),
  "PMS/Channel Manager": z.string().min(1, "Please select your PMS/Channel Manager"),
  "Number of Listings": z.coerce.number().min(1),
  "Cities / Regions": z.array(z.object({ 
    name: z.string(), 
    displayName: z.string(), 
    geonameId: z.number(),
    countryName: z.string(),
    countryCode: z.string(),
    adminName1: z.string().optional()
  })).min(1),
  "Logo Upload": z.object({
    url: z.string().url(),
    name: z.string()
  }).optional(),
  "Highlight Image": z.object({
    url: z.string().url(),
    name: z.string()
  }).optional(),
  "Rating (X/5) & Reviews (#) Screenshot": z.object({
    url: z.string().url(),
    name: z.string()
  }).optional(),
  "One-line Description": z.string().min(5).max(70),
  "Why Book With You?": z.string().min(50, "Please provide at least 50 characters explaining why guests should book with you"),
  "Why Rent With You?": z.string().min(50, "Please provide at least 50 characters explaining why property owners should rent with you"),
  "Commission on Revenue (%)": z.string().min(1, "Please enter your commission percentage").transform((val) => {
    // Remove % symbol and convert to number, then back to string for Airtable
    const cleanVal = val.replace(/%/g, '').trim();
    const num = parseFloat(cleanVal);
    if (isNaN(num) || num < 0 || num > 100) {
      throw new Error("Please enter a valid percentage between 0 and 100");
    }
    return num.toString(); // Return as string but ensure it's a valid number
  }),
  "Top Stats": z.string().min(1, "Please share your top stats (e.g., average rating, number of reviews, etc.)"),
  "Currency": z.string().min(1, "Please select a currency"),
  "Min Price": z.string().min(1, "Please enter a minimum price"),
  "Max Price": z.string().min(1, "Please enter a maximum price"),
  "Types of Stays": z.array(z.string()).optional(),
  "Ideal For": z.array(z.string()).optional(),
  "Is your brand pet-friendly?": z.boolean().optional(),
  "Properties Features": z.array(z.string()).optional(),
  "Services & Convenience": z.array(z.string()).optional(),
  "Lifestyle & Values": z.array(z.string()).optional(),
  "Eco-Conscious Stay?": z.boolean().optional(),
  "Remote-Work Friendly?": z.boolean().optional(),
  "Design Styles": z.array(z.string()).optional(),
  "Atmospheres": z.array(z.string()).optional(),
  "Settings/Locations": z.array(z.string()).optional(),
  "Instagram": z.string().url().optional().or(z.literal("")),
  "Facebook": z.string().url().optional().or(z.literal("")),
  "LinkedIn": z.string().url().optional().or(z.literal("")),
  "TikTok": z.string().url().optional().or(z.literal("")),
  "YouTube / Video Tour": z.string().url().optional().or(z.literal("")),
  "Choose Your Listing Type": planEnum,
  "Submitted By (Email)": z.string().email(),
  "Countries": z.array(z.string()).optional(),
});
type FormValues = z.infer<typeof formSchema>;

// Constants
const CITIES = [
  "New York", "Paris", "Bali", "Lisbon", "Dolomites", "Rome", "Bangkok", "Athens"
];
const TYPES_OF_STAYS = [
  "Apartments", "Bungalows", "Cabins", "Campervans", "Chalets", "Condos", "Domes", "Guesthouses", "Hostels", "Hotels", "Houses", "Rooms", "Tents", "Villas"
];
const IDEAL_FOR = [
  "Companies", "Couples", "Digital Nomads", "Families", "Groups", "Retreats", "Seniors/Elderly", "Solo travelers"
];
const PROPERTIES_FEATURES = [
  "Air Conditioning", "Balcony/Terrace", "BBQ/Grill", "Dedicated workspace", "Dishwasher", 
  "Dryer", "EV Charging", "Fireplace", "Garage", "Garden/Outdoor Space", "Hair dryer", "Heating", 
  "Hot Tub/Jacuzzi", "Iron", "Kitchen/Kitchenette", "Parking", "Pool", "Washer", "WiFi"
];
const SERVICES_CONVENIENCE = [
  "24/7 Support", "Airport transfer", "Bike rental", "Breakfast included", "Car rental", "Concierge", 
  "Early check-in", "Grocery delivery", "Late check-out", "Luggage storage", "Mid-stay cleaning", 
  "Room service", "Self check-in"
];
const LIFESTYLE_VALUES = [
  "Adults only", "Budget-friendly", "Eco-friendly", "Family-friendly", "LGBTQ+ friendly", "Luxury amenities", 
  "Party-friendly", "Pet-friendly", "Quiet/Peaceful", "Remote-work friendly", "Smoking friendly", 
  "Sustainable practices", "Wheelchair accessible"
];
const DESIGN_STYLE = [
  "Art Deco", "Design-led/Contemporary", "Industrial", "Mid-century Modern", "Minimalist", "Modern", 
  "Scandinavian", "Traditional/Classic"
];
const ATMOSPHERES = [
  "Artistic/Creative", "Boho/Bohemian", "Bright/Airy", "Cozy/Intimate", "Luxury/Upscale", "Romantic", 
  "Rustic/Countryside", "Zen/Peaceful"
];
const SETTINGS_LOCATIONS = [
  "Beach/Coastal", "Countryside/Rural", "Desert/Unique Landscape", "Forest/Nature", "Historic/Heritage", 
  "Mountain/Alpine", "Urban/City", "Wine Country"
];
const PMS_OPTIONS = [
  "365 Villas", "Apaleo", "Avantio", "Barefoot", "Beds24", "Bookingsync", "Ciirus", "Cloudbeds", 
  "Escapia", "Guesty", "Hospiria", "Hospitable", "Hostaway", "Hostfully", "Hostify", "Icnea", 
  "iGMS", "Iloca", "Kross Booking", "Liverez", "LMPM", "Lodgify", "Mews", "MyVR", "None", 
  "Octorate", "Opera", "Other", "Own PMS", "OwnerRez", "Rentals United", "Smily", "Smoobu", 
  "Streamline", "Supercontrol", "Tokeet", "Track", "Uplisting", "Lodgix", "Fantasticstay", 
  "Zeevou", "Direct", "Avaibook", "RentalWise", "Your.rentals", "Hostex", "Elina", "Tempo", 
  "mr.alfred", "resly", "Hosthub", "Jurny", "Eviivo", "cubilis", "mytourist", "ciaobooking", 
  "newbook", "v-office", "amenitiz", "Superhote", "Pass pass", "RMS cloud", "Rental Ninja", 
  "Septeo", "Arkane", "Barefoot", "Bookster", "Ynov", "Talkguest", "Beerent", "MyRent", 
  "Rentlio", "Loggia", "Rentability", "Destination Solutions", "Fewo-Verwalter", "Secra", "Fewo One"
];
const CURRENCIES = [
  "AED – د.إ", "AFN – ؋", "ALL – Lek", "AMD – ֏", "AOA – Kz", "ARS – AR$", "AUD – AU$", "AWG – AWƒ", "AZN – ₼", "BAM – KM",
  "BBD – BB$", "BDT – ৳", "BGN – лв", "BHD – ب.د", "BIF – FBu", "BMD – BM$", "BND – BN$", "BOB – Bs", "BRL – R$", "BSD – BS$",
  "BTN – Nu", "BYN – Br", "CAD – CA$", "CDF – FCF", "CHF – CHFr", "CLP – CL$", "CNY – CN¥", "COP – CO$", "CRC – ₡", "CUP – CU$",
  "CZK – Kč", "DJF – Fdj", "DKK – kr", "DOP – RD$", "DZD – د.ج", "EGP – LE", "ERN – Nkf", "ETB – Br", "EUR – €", "FJD – FJ$",
  "GBP – £", "GEL – ₾", "GHS – ₵", "GIP – GI£", "GMD – D", "GNF – FG", "GTQ – Q", "HKD – HK$", "HNL – L", "HRK – kn",
  "HUF – Ft", "IDR – Rp", "ILS – ₪", "INR – ₹", "IQD – ع.د", "IRR – ﷼", "ISK – kr", "JMD – JM$", "JOD – د.ا", "JPY – JP¥",
  "KES – KSh", "KGS – с", "KHR – ៛", "KMF – FC", "KRW – ₩", "KWD – ك", "KYD – KY$", "KZT – ₸", "LAK – ₭", "LBP – ل.ل",
  "LKR – රු", "LSL – L", "MAD – د.م", "MDL – L", "MGA – Ar", "MKD – ден", "MMK – K", "MNT – ₮", "MOP – MOP$", "MRU – UM",
  "MUR – MURs", "MVR – Rf", "MWK – MK", "MXN – MX$", "MYR – RM", "MZN – MT", "NAD – NA$", "NGN – ₦", "NIO – NI$", "NOK – kr",
  "NPR – ₨", "NZD – NZ$", "OMR – ر.ع", "PAB – B/.", "PEN – S/.", "PGK – K", "PHP – ₱", "PKR – ₨", "PLN – zł", "PYG – ₲",
  "QAR – ر.ق", "RON – lei", "RSD – RSD", "RUB – ₽", "RWF – FRw", "SAR – ﷼", "SCR – SCRs", "SDG – ج.س", "SEK – kr", "SGD – SG$",
  "SHP – SH£", "SLE – Le", "SRD – SR$", "STN – Db", "SVC – ₡", "SYP – SY£", "THB – ฿", "TJS – ЅМ", "TMT – T", "TND – د.ت",
  "TOP – T$", "TRY – ₺", "TTD – TT$", "TWD – NT$", "TZS – TSh", "UAH – ₴", "UGX – USh", "USD – US$", "UYU – UY$", "UZS – soʻm",
  "VES – Bs.S", "VND – ₫", "XAF – FCFA", "XCD – EC$", "XOF – CFA", "XPF – CFP₣", "YER – ﷼", "ZAR – R", "ZMW – ZK"
];

// Helper for required asterisk with tooltip
const RequiredAsterisk = () => (
  <span
    className="text-red-500 ml-1 align-middle cursor-help"
    aria-label="mandatory"
    title="mandatory"
  >
    *
  </span>
);

export default function Submit() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      "Brand Name": "",
      "PMC General Website": "",
      "Direct Booking Engine URL": "",
      "PMS/Channel Manager": "",
      "Number of Listings": 1,
      "Cities / Regions": [],
      "Logo Upload": { url: "", name: "" },
      "Highlight Image": { url: "", name: "" },
      "Rating (X/5) & Reviews (#) Screenshot": { url: "", name: "" },
      "One-line Description": "",
      "Why Book With You?": "",
      "Why Rent With You?": "",
      "Commission on Revenue (%)": "",
      "Top Stats": "",
      "Currency": "",
      "Min Price": "",
      "Max Price": "",
      "Types of Stays": [],
      "Ideal For": [],
      "Is your brand pet-friendly?": false,
      "Properties Features": [],
      "Services & Convenience": [],
      "Lifestyle & Values": [],
      "Eco-Conscious Stay?": false,
      "Remote-Work Friendly?": false,
      "Design Styles": [],
      "Atmospheres": [],
      "Settings/Locations": [],
      "Instagram": "",
      "Facebook": "",
      "LinkedIn": "",
      "TikTok": "",
      "YouTube / Video Tour": "",
      "Choose Your Listing Type": "Basic (€99.99/year)",
      "Submitted By (Email)": "",
      "Countries": [],
    },
  });

  // Add validation debugging
  const onInvalid = (errors: any) => {
    console.error("🚫🚫🚫 FORM VALIDATION FAILED 🚫🚫🚫");
    console.error("❌ Validation errors:", errors);
    console.log("💰 Current pricing field values:", {
      Currency: form.getValues("Currency"),
      "Min Price": form.getValues("Min Price"),
      "Max Price": form.getValues("Max Price")
    });
    
    // Show all field errors
    Object.keys(errors).forEach(fieldName => {
      console.error(`❌ ${fieldName} error:`, errors[fieldName]);
    });
    
    // Show pricing field specific errors
    if (errors["Currency"]) console.error("💱 Currency error:", errors["Currency"]);
    if (errors["Min Price"]) console.error("💵 Min Price error:", errors["Min Price"]);
    if (errors["Max Price"]) console.error("💶 Max Price error:", errors["Max Price"]);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("🚀🚀🚀 FORM SUBMISSION STARTED 🚀🚀🚀");
      console.log("🔍 ALL FORM VALUES:", values);
      console.log("💰💰💰 PRICING VALUES SPECIFICALLY:", {
        Currency: values["Currency"],
        "Min Price": values["Min Price"], 
        "Max Price": values["Max Price"]
      });
      console.log("📝 FORM VALUES TYPE CHECK:", {
        CurrencyType: typeof values["Currency"],
        MinPriceType: typeof values["Min Price"],
        MaxPriceType: typeof values["Max Price"]
      });
      console.log("✅ PRICING VALIDATION:", {
        CurrencyValid: !!values["Currency"],
        MinPriceValid: !!values["Min Price"],
        MaxPriceValid: !!values["Max Price"],
        CurrencyLength: values["Currency"]?.length || 0,
        MinPriceValue: values["Min Price"],
        MaxPriceValue: values["Max Price"]
      });
      
      // Redirect to Stripe Checkout instead of directly submitting to Airtable
      await createCheckoutSession({
        plan: values["Choose Your Listing Type"], // Plan selection
        email: values["Submitted By (Email)"], // Customer email
        metadata: values // Pass entire form data as metadata
      });
      
      // The user will be redirected to Stripe Checkout
      // Form will be processed via webhook after successful payment
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Payment Error",
        description: "Failed to redirect to payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Extract countries from selected cities and populate countries field
  const extractCountriesFromCities = (cities: any[]) => {
    const countries = new Set<string>();
    
    cities.forEach(city => {
      if (city.displayName) {
        // Parse "City, Region, Country" format
        const parts = city.displayName.split(', ');
        if (parts.length >= 3) {
          const country = parts[2]; // Last part is the country
          countries.add(country);
        }
      }
    });
    
    return Array.from(countries);
  };

  // Watch cities changes to auto-populate countries
  const selectedCities = form.watch("Cities / Regions");
  const extractedCountries = useMemo(() => {
    if (selectedCities && selectedCities.length > 0) {
      return extractCountriesFromCities(selectedCities);
    }
    return [];
  }, [selectedCities]);

  // Update countries field when cities change
  useEffect(() => {
    if (extractedCountries.length > 0) {
      form.setValue("Countries", extractedCountries);
    }
  }, [extractedCountries, form]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">🚀 List Your Management Company!</h1>
        <p className="text-gray-600 mb-4">Join our directory and connect with property owners worldwide.</p>
        
        {/* FindRentalManager Cross-Promotion */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-lg">💼</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Double Your Visibility!</h3>
              <p className="text-blue-800 text-sm">
                Your listing will also appear on <strong>BookDirectStays</strong> to boost visibility among travelers, 
                helping you generate more direct bookings. Get exposure on both platforms with one submission!
              </p>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
            {/* Section 1: Brand Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🧾 Brand Info</h2>
              <FormField control={form.control} name="Submitted By (Email)" render={({ field }) => (
                <FormItem>
                  <FormLabel>Your e-mail<RequiredAsterisk /></FormLabel>
                  <FormControl><Input type="email" {...field} placeholder="e.g. john@yourdomain.com" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Brand Name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name<RequiredAsterisk /></FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Vacasa" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="PMC General Website" render={({ field }) => (
                <FormItem>
                  <FormLabel>PMC General Website<RequiredAsterisk /></FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://yourdomain.com/" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Direct Booking Engine URL" render={({ field }) => (
                <FormItem>
                  <FormLabel>Direct Booking Engine URL<RequiredAsterisk /></FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://yourdomain.com/book" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="PMS/Channel Manager" render={({ field }) => (
                <FormItem>
                  <FormLabel>PMS/Channel Manager<RequiredAsterisk /></FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={PMS_OPTIONS}
                      selected={field.value ? [field.value] : []}
                      onSelect={(values) => {
                        // For PMS, we only want single selection (same logic as Currency)
                        const latestSelection = values[values.length - 1];
                        field.onChange(latestSelection || "");
                      }}
                      placeholder="Search and select your PMS/Channel Manager"
                      showSelectAll={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Number of Listings" render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Listings<RequiredAsterisk /></FormLabel>
                  <FormControl><Input type="number" min="1" {...field} placeholder="0" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Cities / Regions" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cities<RequiredAsterisk /></FormLabel>
                  <FormDescription>
                    Select the cities where you operate. Countries will be automatically determined.
                  </FormDescription>
                  <FormControl>
                    <CityRegionAsyncMultiSelect
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. New York, Paris"
                      className={field.value && field.value.length > 0 ? 'border-blue-500 bg-blue-50' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Logo Upload" render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo<RequiredAsterisk /></FormLabel>
                  <FormControl>
                    <FileDrop
                      onFileDrop={(file: File) => {
                        field.onChange({
                          url: URL.createObjectURL(file),
                          name: file.name
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Highlight Image" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Highlight Image (This will be the main image shown on your company card in the directory)
                    <RequiredAsterisk />
                  </FormLabel>
                  <FormControl>
                    <FileDrop
                      onFileDrop={(file: File) => {
                        field.onChange({
                          url: URL.createObjectURL(file),
                          name: file.name
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="Rating (X/5) & Reviews (#) Screenshot" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rating & Reviews Screenshot (Upload a screenshot showing your ratings and number of reviews from booking platforms)
                    <RequiredAsterisk />
                  </FormLabel>
                  <FormControl>
                    <FileDrop
                      onFileDrop={(file: File) => {
                        field.onChange({
                          url: URL.createObjectURL(file),
                          name: file.name
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 2: Brand Story & Guest Value */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">💬 Brand Story & Guest Value</h2>
              <FormField control={form.control} name="One-line Description" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    One-line Description (70 characters limit)<RequiredAsterisk />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        placeholder="e.g. Boutique apartments in Latin America" 
                        maxLength={70}
                        className={field.value ? 'border-blue-500 bg-blue-50' : ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 70) {
                            field.onChange(e);
                          }
                        }}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {field.value?.length || 0}/70
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Why Book With You?" render={({ field }) => (
                <FormItem>
                  <FormLabel>Why Book With You? (for guests)<RequiredAsterisk /></FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Tell potential guests why they should choose your properties over others. Include unique features, exceptional service, special amenities, or any other compelling reasons. Minimum 50 characters."
                      className={`min-h-[120px] ${field.value ? 'border-blue-500 bg-blue-50' : ''}`}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <span className={`text-xs ${field.value && field.value.length < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                      {field.value?.length || 0}/50 characters minimum
                    </span>
                  </div>
                </FormItem>
              )} />

              <FormField control={form.control} name="Why Rent With You?" render={({ field }) => (
                <FormItem>
                  <FormLabel>Why Rent With You? (for owners)<RequiredAsterisk /></FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Tell property owners why they should partner with you for their vacation rental management. Include your expertise, marketing reach, revenue optimization, guest services, or other value propositions. Minimum 50 characters."
                      className={`min-h-[120px] ${field.value ? 'border-blue-500 bg-blue-50' : ''}`}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <span className={`text-xs ${field.value && field.value.length < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                      {field.value?.length || 0}/50 characters minimum
                    </span>
                  </div>
                </FormItem>
              )} />

              <FormField control={form.control} name="Commission on Revenue (%)" render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission on Revenue (%)<RequiredAsterisk /></FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="text"
                      placeholder="e.g. 15%, 20%, 25%"
                      className={field.value ? 'border-blue-500 bg-blue-50' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="Top Stats" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Top Stats <RequiredAsterisk /> (List semicolon ";" separated)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Airbnb SuperHost Badge; 4.8 stars on Airbnb; Over 1000 reviews across platforms; The Shortyz Award for Sustainability" className={field.value ? 'border-blue-500 bg-blue-50' : ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Pricing Section */}
              <FormField control={form.control} name="Currency" render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency <RequiredAsterisk /></FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={CURRENCIES}
                      selected={field.value ? [field.value] : []}
                      onSelect={(values) => {
                        // For currency, we only want single selection
                        const latestSelection = values[values.length - 1];
                        field.onChange(latestSelection || "");
                      }}
                      placeholder="Search and select currency (e.g. USD – US$, EUR – €)"
                      showSelectAll={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="Min Price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>From: Min Price <RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        placeholder="150"
                        className={field.value ? 'border-blue-500 bg-blue-50' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="Max Price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>To: Max Price <RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="1"
                        {...field}
                        placeholder="300"
                        className={field.value ? 'border-blue-500 bg-blue-50' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="Types of Stays" render={({ field }) => (
                <FormItem>
                  <FormLabel>Types of Stays</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={TYPES_OF_STAYS}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Villas, Cabins"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Ideal For" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ideal For</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={IDEAL_FOR}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Families, Digital Nomads"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 3: Properties & Amenities */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🎁 Properties & Amenities <span className='text-base font-normal text-green-700'>(the more, the better)</span></h2>
              
              <FormField control={form.control} name="Properties Features" render={({ field }) => (
                <FormItem>
                  <FormLabel>🏠 Properties Features</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={PROPERTIES_FEATURES}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Pool, WiFi, Hot Tub"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="Services & Convenience" render={({ field }) => (
                <FormItem>
                  <FormLabel>💼 Services & Convenience</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={SERVICES_CONVENIENCE}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Self check-in, Concierge"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="Lifestyle & Values" render={({ field }) => (
                <FormItem>
                  <FormLabel>🌱 Lifestyle & Values</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={LIFESTYLE_VALUES}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Pet-friendly, Eco-friendly"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 4: Vibe & Style */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🎨 Vibe & Style</h2>
              
              <FormField control={form.control} name="Design Styles" render={({ field }) => (
                <FormItem>
                  <FormLabel>🏛️ Design Styles</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={DESIGN_STYLE}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Modern, Minimalist"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="Atmospheres" render={({ field }) => (
                <FormItem>
                  <FormLabel>🌿 Atmospheres</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={ATMOSPHERES}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Luxury/Upscale, Cozy/Intimate"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="Settings/Locations" render={({ field }) => (
                <FormItem>
                  <FormLabel>🏞️ Settings/Locations</FormLabel>
                  <FormControl>
                    <SearchableMultiSelect
                      options={SETTINGS_LOCATIONS}
                      selected={field.value || []}
                      onSelect={values => field.onChange(values)}
                      placeholder="e.g. Beach/Coastal, Urban/City"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Section 5: Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">📲 Social Links <span className='text-base font-normal text-green-700'>(Recommended for higher conversion)</span></h2>
              <FormField control={form.control} name="Instagram" render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://instagram.com/yourcompanyname" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Facebook" render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://facebook.com/yourcompanyname" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="LinkedIn" render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://linkedin.com/company/yourcompanyname" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="TikTok" render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://tiktok.com/@yourcompanyname" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="YouTube / Video Tour" render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube / Video Tour</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. https://youtube.com/watch?v=xxxx" className={field.value ? 'border-blue-500 bg-blue-50' : ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Plan selection now at the bottom */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Choose your plan</h2>
              
              {/* Early Bird Promotion - Above Plans */}
              <div className="text-center mb-6">
                <p className="text-red-600 font-bold text-lg">
                  🎯 Early bird promotion for the first 2000, get listed now and save 50%!
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div
                  className={`flex-1 border rounded-xl p-6 cursor-pointer transition-all relative flex flex-col ${form.watch("Choose Your Listing Type") === "Basic (€99.99/year)" ? "border-primary bg-primary/5 shadow-lg" : "border-gray-200 bg-white"}`}
                  onClick={() => form.setValue("Choose Your Listing Type", "Basic (€99.99/year)")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={form.watch("Choose Your Listing Type") === "Basic (€99.99/year)"}
                >
                  <div className="flex items-start justify-between mb-2 min-h-[40px]">
                    <div />
                    <div className="text-right">
                      <div className="line-through text-gray-500 text-sm mb-1">€199.99/year</div>
                      <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">€99.99/year</div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Basic Listing</h2>
                  <p className="text-gray-500 mb-4">Standard listing in our directory</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Standard placement in search results</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Detailed stays info</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Link to your booking website</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Get listed in 1-3 months</li>
                  </ul>
                  <div className="mt-auto">
                    <Button variant={form.watch("Choose Your Listing Type") === "Basic (€99.99/year)" ? "default" : "outline"} className="w-full" type="button" onClick={() => form.setValue("Choose Your Listing Type", "Basic (€99.99/year)")}>Select Basic</Button>
                  </div>
                </div>
                <div
                  className={`flex-1 border rounded-xl p-6 cursor-pointer transition-all relative flex flex-col ${form.watch("Choose Your Listing Type") === "Premium (€499.99/year)" ? "border-green-500 bg-green-50 shadow-lg" : "border-gray-200 bg-white"}`}
                  onClick={() => form.setValue("Choose Your Listing Type", "Premium (€499.99/year)")}
                  tabIndex={0}
                  role="button"
                  aria-pressed={form.watch("Choose Your Listing Type") === "Premium (€499.99/year)"}
                >
                  <div className="flex items-start justify-between mb-2 min-h-[40px]">
                    <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">Recommended</span>
                    <div className="text-right">
                      <div className="line-through text-gray-500 text-sm mb-1">€999.99/year</div>
                      <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">€499.99/year</div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Premium Listing</h2>
                  <p className="text-gray-500 mb-4">Priority placement with marketing support</p>
                  <div className="mb-2 font-medium text-gray-700">Same as Basic Listing + :</div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Priority placement in search results</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Featured badge for increased visibility</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Social media ads support</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Website banner ads</li>
                    <li className="flex items-center text-green-600"><span className="mr-2">✔️</span> Get listed instantly</li>
                  </ul>
                  <div className="mt-auto">
                    <Button variant={form.watch("Choose Your Listing Type") === "Premium (€499.99/year)" ? "default" : "outline"} className="w-full" type="button" onClick={() => form.setValue("Choose Your Listing Type", "Premium (€499.99/year)")}>Select Premium</Button>
                  </div>
                </div>
              </div>
              
              {/* Dynamic summary now directly below the plan boxes */}
              <div className="flex justify-end mt-4">
                {form.watch("Choose Your Listing Type") === "Premium (€499.99/year)" ? (
                  <div className="text-green-800 bg-green-100 text-base font-semibold px-4 py-2 rounded-full inline-block">
                    Premium Listing — Total: €499.99/year
                  </div>
                ) : (
                  <div className="text-blue-800 bg-blue-100 text-base font-semibold px-4 py-2 rounded-full inline-block">
                    Basic Listing — Total: €99.99/year
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="px-8 py-3" 
                disabled={!form.formState.isValid}
                onClick={() => {
                  console.log("🖱️ SUBMIT BUTTON CLICKED");
                  console.log("💰 Pricing values at click:", {
                    Currency: form.getValues("Currency"),
                    "Min Price": form.getValues("Min Price"),
                    "Max Price": form.getValues("Max Price")
                  });
                  console.log("🔍 Form errors at click:", form.formState.errors);
                  console.log("✅ Form valid at click:", form.formState.isValid);
                  console.log("📝 Form values:", form.getValues());
                }}
              >
                Submit Listing
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
