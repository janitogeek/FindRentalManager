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
  "Brand Name": z.string().min(2, "Brand name must be at least 2 characters"),
  "One-line Description": z.string().min(10, "Description must be at least 10 characters"),
  "Why Book With You?": z.string().min(50, "Please provide at least 50 characters explaining why guests should book with you"),
  "Why Rent With You?": z.string().min(50, "Please provide at least 50 characters explaining why property owners should rent with you"),
  "Commission on Revenue (%)": z.string().min(1, "Please enter your commission percentage").transform((val) => {
    const cleanVal = val.replace(/%/g, '').trim();
    const num = parseFloat(cleanVal);
    if (isNaN(num) || num < 0 || num > 100) {
      throw new Error("Please enter a valid percentage between 0 and 100");
    }
    return num.toString(); // Return as string but ensure it's a valid number
  }),
  "Choose Your Listing Type": planEnum,
  "Countries": z.array(z.string()).min(1, "Please select at least one country"),
  "Cities / Regions": z.array(z.any()).min(1, "Please select at least one city/region"),
  "Types of Stays": z.array(z.string()).min(1, "Please select at least one type of stay"),
  "Ideal For": z.array(z.string()).min(1, "Please select at least one ideal guest type"),
  "Properties Features": z.array(z.string()).min(1, "Please select at least one property feature"),
  "Services & Convenience": z.array(z.string()).min(1, "Please select at least one service"),
  "Lifestyle & Values": z.array(z.string()).min(1, "Please select at least one lifestyle value"),
  "Design Style": z.array(z.string()).min(1, "Please select at least one design style"),
  "Atmospheres": z.array(z.string()).min(1, "Please select at least one atmosphere"),
  "Settings/Locations": z.array(z.string()).min(1, "Please select at least one setting"),
  "PMS/Channel Manager": z.string().min(1, "Please select your PMS/Channel Manager"),
  "Number of Listings": z.number().min(1, "Please enter the number of listings"),
  "Email": z.string().email("Please enter a valid email address"),
  "Logo": z.any().optional(),
  "Highlight Image": z.any().optional(),
  "Rating Screenshot": z.any().optional(),
  "Instagram": z.string().optional(),
  "Facebook": z.string().optional(),
  "LinkedIn": z.string().optional(),
  "TikTok": z.string().optional(),
  "YouTube / Video Tour": z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TYPES_OF_STAYS = [
  "Apartments", "Bungalows", "Cabins", "Campervans", "Chalets", "Condos", "Domes", "Guesthouses", 
  "Hostels", "Hotels", "Houses", "Rooms", "Tents", "Villas"
];

const IDEAL_FOR = [
  "Companies", "Couples", "Digital Nomads", "Families", "Groups", "Retreats", "Seniors/Elderly", "Solo travelers"
];

const PROPERTIES_FEATURES = [
  "Air Conditioning", "Balcony/Terrace", "BBQ/Grill", "Dedicated workspace", "Dishwasher", "Dryer", 
  "EV Charging", "Fireplace", "Garage", "Garden/Outdoor Space", "Hair dryer", "Heating", 
  "Hot Tub/Jacuzzi", "Iron", "Kitchen/Kitchenette", "Parking", "Pool", "Washer", "WiFi"
];

const SERVICES_CONVENIENCE = [
  "24/7 Support", "Airport transfer", "Bike rental", "Breakfast included", "Car rental", "Concierge", 
  "Early check-in", "Grocery delivery", "Late check-out", "Luggage storage", "Mid-stay cleaning", 
  "Room service", "Self check-in"
];

const LIFESTYLE_VALUES = [
  "Adults only", "Budget-friendly", "Eco-friendly", "Family-friendly", "LGBTQ+ friendly", 
  "Luxury amenities", "Party-friendly", "Pet-friendly", "Quiet/Peaceful", "Remote-work friendly", 
  "Smoking friendly", "Sustainable practices", "Wheelchair accessible"
];

const DESIGN_STYLE = [
  "Art Deco", "Design-led/Contemporary", "Industrial", "Mid-century Modern", "Minimalist", 
  "Modern", "Scandinavian", "Traditional/Classic"
];

const ATMOSPHERES = [
  "Artistic/Creative", "Boho/Bohemian", "Bright/Airy", "Cozy/Intimate", "Luxury/Upscale", 
  "Romantic", "Rustic/Countryside", "Zen/Peaceful"
];

const SETTINGS_LOCATIONS = [
  "Beach/Coastal", "Countryside/Rural", "Desert/Unique Landscape", "Forest/Nature", 
  "Historic/Heritage", "Mountain/Alpine", "Urban/City", "Wine Country"
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

// Helper for required asterisk with tooltip
const RequiredAsterisk = () => (
  <span className="text-red-500 ml-1 align-middle cursor-help" aria-label="mandatory" title="mandatory">
    *
  </span>
);

export default function Submit() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      "Brand Name": "",
      "One-line Description": "",
      "Why Book With You?": "",
      "Why Rent With You?": "",
      "Commission on Revenue (%)": "",
      "Choose Your Listing Type": "Basic (€99.99/year)",
      "Countries": [],
      "Cities / Regions": [],
      "Types of Stays": [],
      "Ideal For": [],
      "Properties Features": [],
      "Services & Convenience": [],
      "Lifestyle & Values": [],
      "Design Style": [],
      "Atmospheres": [],
      "Settings/Locations": [],
      "PMS/Channel Manager": "",
      "Number of Listings": 1,
      "Email": "",
      "Logo": undefined,
      "Highlight Image": undefined,
      "Rating Screenshot": undefined,
      "Instagram": "",
      "Facebook": "",
      "LinkedIn": "",
      "TikTok": "",
      "YouTube / Video Tour": "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("🚀 Form submission started:", values);

      // Store form data for processing after payment
      setFormData(values);

      // Create Stripe checkout session
      await createCheckoutSession({
        plan: values["Choose Your Listing Type"],
        email: values["Email"],
        metadata: values
      });

    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Payment Error",
        description: "Failed to redirect to payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">🚀 List Your Management Company!</h1>
        <p className="text-gray-600 mb-4">Join our directory and connect with property owners worldwide.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Brand Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🏢 Brand Information</h2>
              
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="e.g. john@yourdomain.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Brand Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Vacasa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="One-line Description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-line Description<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Boutique apartments in Latin America" maxLength={70} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="PMS/Channel Manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PMS/Channel Manager<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <SearchableMultiSelect
                        options={PMS_OPTIONS}
                        selected={field.value ? [field.value] : []}
                        onSelect={(values) => {
                          const latestSelection = values[values.length - 1];
                          field.onChange(latestSelection || "");
                        }}
                        placeholder="Search and select your PMS/Channel Manager"
                        showSelectAll={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Number of Listings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Listings<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 2: Location & Coverage */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🌍 Location & Coverage</h2>
              
              <FormField
                control={form.control}
                name="Countries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Countries<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <CountryMultiSelect
                        selected={field.value || []}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Cities / Regions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cities / Regions<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <CityRegionAsyncMultiSelect
                        selected={field.value || []}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 3: Value Propositions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">💼 Value Propositions</h2>
              
              <FormField
                control={form.control}
                name="Why Book With You?"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why Book With You? (for guests)<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell potential guests why they should choose your properties..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Why Rent With You?"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why Rent With You? (for owners)<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell property owners why they should partner with you..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Commission on Revenue (%)"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission on Revenue (%)<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 15%, 20%, 25%" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 4: Property Features */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🏠 Property Features</h2>
              
              <FormField
                control={form.control}
                name="Types of Stays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Types of Stays<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <SearchableMultiSelect
                        options={TYPES_OF_STAYS}
                        selected={field.value || []}
                        onSelect={field.onChange}
                        placeholder="Select types of stays you offer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Ideal For"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ideal For<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <SearchableMultiSelect
                        options={IDEAL_FOR}
                        selected={field.value || []}
                        onSelect={field.onChange}
                        placeholder="Select ideal guest types"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Properties Features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Features<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <SearchableMultiSelect
                        options={PROPERTIES_FEATURES}
                        selected={field.value || []}
                        onSelect={field.onChange}
                        placeholder="Select property features you offer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Services & Convenience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services & Convenience<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <SearchableMultiSelect
                        options={SERVICES_CONVENIENCE}
                        selected={field.value || []}
                        onSelect={field.onChange}
                        placeholder="Select services you provide"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Lifestyle & Values"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lifestyle & Values<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <SearchableMultiSelect
                        options={LIFESTYLE_VALUES}
                        selected={field.value || []}
                        onSelect={field.onChange}
                        placeholder="Select lifestyle values you support"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 5: Style & Atmosphere */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🎨 Style & Atmosphere</h2>
              
              <FormField
                control={form.control}
                name="Design Style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Style<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <SearchableMultiSelect
                        options={DESIGN_STYLE}
                        selected={field.value || []}
                        onSelect={field.onChange}
                        placeholder="Select design styles you offer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Atmospheres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atmospheres<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <SearchableMultiSelect
                        options={ATMOSPHERES}
                        selected={field.value || []}
                        onSelect={field.onChange}
                        placeholder="Select atmospheres you create"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Settings/Locations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Settings/Locations<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <SearchableMultiSelect
                        options={SETTINGS_LOCATIONS}
                        selected={field.value || []}
                        onSelect={field.onChange}
                        placeholder="Select settings/locations you offer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 6: Social Media */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">📱 Social Media</h2>
              
              <FormField
                control={form.control}
                name="Instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://instagram.com/yourcompany" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://facebook.com/yourcompany" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="LinkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://linkedin.com/company/yourcompany" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="TikTok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://tiktok.com/@yourcompany" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="YouTube / Video Tour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube / Video Tour</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/watch?v=xxxx" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 7: Plan Selection */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">💳 Choose Your Plan</h2>
              
              <FormField
                control={form.control}
                name="Choose Your Listing Type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Type<RequiredAsterisk /></FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basic (€99.99/year)">Basic (€99.99/year)</SelectItem>
                          <SelectItem value="Premium (€499.99/year)">Premium (€499.99/year)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Plan Benefits:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• <strong>Basic:</strong> Standard listing, manual review (24-48h)</li>
                  <li>• <strong>Premium:</strong> Priority listing, instant approval, featured placement</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="px-8 py-3" 
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit & Pay"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
