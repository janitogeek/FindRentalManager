import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "@/lib/stripe";
import { 
  Building2, 
  Globe, 
  MapPin, 
  Star, 
  Instagram, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Youtube,
  Upload,
  CheckCircle2
} from "lucide-react";

// Simple cities array for the form
const cities = [
  { geonameId: 1, displayName: "Barcelona, Catalonia, Spain", countryName: "Spain" },
  { geonameId: 2, displayName: "Madrid, Madrid, Spain", countryName: "Spain" },
  { geonameId: 3, displayName: "Rome, Lazio, Italy", countryName: "Italy" },
  { geonameId: 4, displayName: "Milan, Lombardy, Italy", countryName: "Italy" },
  { geonameId: 5, displayName: "Paris, Île-de-France, France", countryName: "France" },
  { geonameId: 6, displayName: "Nice, Provence-Alpes-Côte d'Azur, France", countryName: "France" },
  { geonameId: 7, displayName: "Lisbon, Lisbon, Portugal", countryName: "Portugal" },
  { geonameId: 8, displayName: "Porto, Norte, Portugal", countryName: "Portugal" },
  { geonameId: 9, displayName: "Athens, Attica, Greece", countryName: "Greece" },
  { geonameId: 10, displayName: "Santorini, South Aegean, Greece", countryName: "Greece" },
  { geonameId: 11, displayName: "Zagreb, Zagreb, Croatia", countryName: "Croatia" },
  { geonameId: 12, displayName: "Split, Split-Dalmatia, Croatia", countryName: "Croatia" },
  { geonameId: 13, displayName: "New York, New York, United States", countryName: "United States" },
  { geonameId: 14, displayName: "Los Angeles, California, United States", countryName: "United States" },
  { geonameId: 15, displayName: "Miami, Florida, United States", countryName: "United States" },
  { geonameId: 16, displayName: "Mexico City, Mexico City, Mexico", countryName: "Mexico" },
  { geonameId: 17, displayName: "Cancun, Quintana Roo, Mexico", countryName: "Mexico" },
  { geonameId: 18, displayName: "Bangkok, Bangkok, Thailand", countryName: "Thailand" },
  { geonameId: 19, displayName: "Phuket, Phuket, Thailand", countryName: "Thailand" },
  { geonameId: 20, displayName: "Jakarta, Jakarta, Indonesia", countryName: "Indonesia" },
  { geonameId: 21, displayName: "Bali, Bali, Indonesia", countryName: "Indonesia" },
  { geonameId: 22, displayName: "Toronto, Ontario, Canada", countryName: "Canada" },
  { geonameId: 23, displayName: "Vancouver, British Columbia, Canada", countryName: "Canada" },
  { geonameId: 24, displayName: "Sydney, New South Wales, Australia", countryName: "Australia" },
  { geonameId: 25, displayName: "Melbourne, Victoria, Australia", countryName: "Australia" }
];

// Form schema with Zod validation
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
    return num.toString();
  }),
  "Choose Your Listing Type": z.enum(["Basic (€99.99/year)", "Premium (€499.99/year)"]),
  "PMC General Website": z.string().url("Please enter a valid website URL"),
  "Direct Booking Engine URL": z.string().url("Please enter a valid website URL"),
  "Number of Listings": z.coerce.number().min(1, "Please enter the number of listings"),
  "Cities / Regions": z.array(z.any()).min(1, "Please select at least one city/region"),
  "Top Stats": z.string().min(1, "Please share your top stats (e.g., average rating, number of reviews, etc.)"),
  "Types of Stays": z.array(z.string()).min(1, "Please select at least one type of stay"),
  "Ideal For": z.array(z.string()).min(1, "Please select at least one ideal guest type"),
  "Properties Features": z.array(z.string()).min(1, "Please select at least one property feature"),
  "Services & Convenience": z.array(z.string()).min(1, "Please select at least one service"),
  "Lifestyle & Values": z.array(z.string()).min(1, "Please select at least one lifestyle value"),
  "Design Styles": z.array(z.string()).min(1, "Please select at least one design style"),
  "Atmospheres": z.array(z.string()).min(1, "Please select at least one atmosphere"),
  "Settings/Locations": z.array(z.string()).min(1, "Please select at least one setting/location"),
  "Instagram": z.string().optional(),
  "Facebook": z.string().optional(),
  "LinkedIn": z.string().optional(),
  "TikTok": z.string().optional(),
  "YouTube / Video Tour": z.string().optional(),
  "Logo Upload": z.any().optional(),
  "Highlight Image": z.any().optional(),
  "Rating (X/5) & Reviews (#) Screenshot": z.any().optional(),
  "Submitted By (Email)": z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

// Available options for multi-select fields
const availableOptions = {
  "Types of Stays": [
    "Vacation Rentals", "Short-term Rentals", "Long-term Rentals", "Corporate Housing",
    "Luxury Rentals", "Budget Rentals", "Family-friendly", "Pet-friendly",
    "Business Travel", "Leisure Travel", "Extended Stays", "Weekend Getaways"
  ],
  "Ideal For": [
    "Families", "Couples", "Solo Travelers", "Business Travelers", "Groups",
    "Digital Nomads", "Luxury Seekers", "Budget Travelers", "Adventure Seekers",
    "Relaxation Seekers", "Culture Enthusiasts", "Nature Lovers"
  ],
  "Properties Features": [
    "WiFi", "Kitchen", "Washing Machine", "Air Conditioning", "Heating",
    "Parking", "Garden", "Balcony", "Pool", "Hot Tub", "Fireplace",
    "Workspace", "Gym", "Spa", "Restaurant", "Bar"
  ],
  "Services & Convenience": [
    "24/7 Support", "Concierge Service", "Cleaning Service", "Linen Service",
    "Airport Transfer", "Car Rental", "Tour Booking", "Restaurant Reservations",
    "Grocery Delivery", "Laundry Service", "Childcare", "Pet Sitting"
  ],
  "Lifestyle & Values": [
    "Eco-friendly", "Sustainable", "Local Experience", "Cultural Immersion",
    "Wellness Focus", "Adventure Ready", "Luxury Experience", "Authentic Local",
    "Community Connection", "Privacy Focus", "Accessibility", "Inclusive"
  ],
  "Design Styles": [
    "Modern", "Traditional", "Minimalist", "Bohemian", "Industrial",
    "Scandinavian", "Mediterranean", "Tropical", "Rustic", "Contemporary",
    "Vintage", "Art Deco", "Mid-century Modern", "Coastal", "Mountain"
  ],
  "Atmospheres": [
    "Relaxing", "Energetic", "Romantic", "Family-friendly", "Social",
    "Quiet", "Luxurious", "Cozy", "Spacious", "Intimate", "Professional",
    "Creative", "Adventurous", "Peaceful", "Vibrant"
  ],
  "Settings/Locations": [
    "City Center", "Beachfront", "Mountain View", "Countryside", "Urban",
    "Suburban", "Rural", "Coastal", "Alpine", "Desert", "Forest",
    "Lakefront", "Riverside", "Historic District", "Business District"
  ]
};

export default function SubmitPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCities, setSelectedCities] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "Brand Name": "",
      "One-line Description": "",
      "Why Book With You?": "",
      "Why Rent With You?": "",
      "Commission on Revenue (%)": "0",
      "Choose Your Listing Type": "Basic (€99.99/year)",
      "PMC General Website": "",
      "Direct Booking Engine URL": "",
      "Number of Listings": 1,
      "Cities / Regions": [],
      "Top Stats": "",
      "Types of Stays": [],
      "Ideal For": [],
      "Properties Features": [],
      "Services & Convenience": [],
      "Lifestyle & Values": [],
      "Design Styles": [],
      "Atmospheres": [],
      "Settings/Locations": [],
      "Instagram": "",
      "Facebook": "",
      "LinkedIn": "",
      "TikTok": "",
      "YouTube / Video Tour": "",
      "Logo Upload": null,
      "Highlight Image": null,
      "Rating (X/5) & Reviews (#) Screenshot": null,
      "Submitted By (Email)": "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("🚀 Form submission started:", values);

      // Redirect to Stripe Checkout
      await createCheckoutSession({
        plan: values["Choose Your Listing Type"],
        email: values["Submitted By (Email)"],
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

  const handleCitySelection = (city: any) => {
    const isSelected = selectedCities.some(c => c.geonameId === city.geonameId);
    if (isSelected) {
      setSelectedCities(selectedCities.filter(c => c.geonameId !== city.geonameId));
      form.setValue("Cities / Regions", selectedCities.filter(c => c.geonameId !== city.geonameId));
    } else {
      const newSelection = [...selectedCities, city];
      setSelectedCities(newSelection);
      form.setValue("Cities / Regions", newSelection);
    }
  };

  const handleMultiSelect = (field: keyof typeof availableOptions, value: string) => {
    const currentValues = form.getValues(field) as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    form.setValue(field, newValues);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 List Your Management Company!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the world's premier directory of property management companies. 
              Connect with property owners worldwide and grow your business.
            </p>
          </div>

          {/* Info Box */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Dual Visibility</h3>
                  <p className="text-blue-800 text-sm">
                    Your listing will also appear on BookDirectStays.com to boost guest visibility 
                    and increase direct bookings. One submission, two platforms!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Tell us about your management company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="brandName">Brand Name *</Label>
                    <Input
                      id="brandName"
                      {...form.register("Brand Name")}
                      placeholder="e.g., Urban Stays Management"
                    />
                    {form.formState.errors["Brand Name"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors["Brand Name"].message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">One-line Description *</Label>
                    <Input
                      id="description"
                      {...form.register("One-line Description")}
                      placeholder="e.g., Professional vacation rental management"
                    />
                    {form.formState.errors["One-line Description"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors["One-line Description"].message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="whyBookWithYou">Why Book With You? *</Label>
                  <Textarea
                    id="whyBookWithYou"
                    {...form.register("Why Book With You?")}
                    placeholder="Explain why guests should choose your management services (minimum 50 characters)"
                    className="min-h-[120px]"
                  />
                  {form.formState.errors["Why Book With You?"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors["Why Book With You?"].message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="whyRentWithYou">Why Rent With You? *</Label>
                  <Textarea
                    id="whyRentWithYou"
                    {...form.register("Why Rent With You?")}
                    placeholder="Explain why property owners should choose your management services (minimum 50 characters)"
                    className="min-h-[120px]"
                  />
                  {form.formState.errors["Why Rent With You?"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors["Why Rent With You?"].message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="commission">Commission on Revenue (%) *</Label>
                  <Input
                    id="commission"
                    {...form.register("Commission on Revenue (%)")}
                    placeholder="e.g., 15"
                    className={form.watch("Commission on Revenue (%)") ? 'border-green-500 bg-green-50' : ''}
                  />
                  {form.formState.errors["Commission on Revenue (%)"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors["Commission on Revenue (%)"].message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Listing Type</CardTitle>
                <CardDescription>
                  Select the plan that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      form.watch("Choose Your Listing Type") === "Basic (€99.99/year)"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => form.setValue("Choose Your Listing Type", "Basic (€99.99/year)")}
                  >
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Basic</h3>
                      <p className="text-2xl font-bold text-blue-600">€99.99</p>
                      <p className="text-sm text-gray-600">per year</p>
                      <p className="text-xs text-gray-500 mt-2">Pending Review</p>
                    </div>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      form.watch("Choose Your Listing Type") === "Premium (€499.99/year)"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => form.setValue("Choose Your Listing Type", "Premium (€499.99/year)")}
                  >
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Premium</h3>
                      <p className="text-2xl font-bold text-purple-600">€499.99</p>
                      <p className="text-sm text-gray-600">per year</p>
                      <p className="text-xs text-green-600 mt-2">Auto-Approved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Website */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Contact & Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="pmcWebsite">PMC General Website *</Label>
                    <Input
                      id="pmcWebsite"
                      {...form.register("PMC General Website")}
                      placeholder="https://yourcompany.com"
                    />
                    {form.formState.errors["PMC General Website"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors["PMC General Website"].message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="directBooking">Direct Booking Engine URL *</Label>
                    <Input
                      id="directBooking"
                      {...form.register("Direct Booking Engine URL")}
                      placeholder="https://book.yourcompany.com"
                    />
                    {form.formState.errors["Direct Booking Engine URL"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors["Direct Booking Engine URL"].message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("Submitted By (Email)")}
                    placeholder="your@email.com"
                  />
                  {form.formState.errors["Submitted By (Email)"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors["Submitted By (Email)"].message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="listings">Number of Listings *</Label>
                    <Input
                      id="listings"
                      type="number"
                      {...form.register("Number of Listings")}
                      min="1"
                    />
                    {form.formState.errors["Number of Listings"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors["Number of Listings"].message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="topStats">Top Stats *</Label>
                    <Input
                      id="topStats"
                      {...form.register("Top Stats")}
                      placeholder="e.g., 4.8/5 rating, 500+ reviews"
                    />
                    {form.formState.errors["Top Stats"] && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors["Top Stats"].message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Top Stats *</Label>
                  <Input
                    {...form.register("Top Stats")}
                    placeholder="e.g., 4.8/5 rating, 500+ reviews, 95% occupancy rate"
                  />
                  {form.formState.errors["Top Stats"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors["Top Stats"].message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
                <CardDescription>
                  Select the cities where you operate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {cities.map((city) => (
                    <div
                      key={city.geonameId}
                      className={`p-2 text-sm border rounded cursor-pointer transition-all ${
                        selectedCities.some(c => c.geonameId === city.geonameId)
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => handleCitySelection(city)}
                    >
                      {city.displayName}
                    </div>
                  ))}
                </div>
                {form.formState.errors["Cities / Regions"] && (
                  <p className="text-red-500 text-sm mt-2">
                    {form.formState.errors["Cities / Regions"].message}
                  </p>
                )}
                {selectedCities.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedCities.length} city/cities
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Multi-select Options */}
            {Object.entries(availableOptions).map(([fieldName, options]) => (
              <Card key={fieldName}>
                <CardHeader>
                  <CardTitle className="text-lg">{fieldName} *</CardTitle>
                  <CardDescription>
                    Select all that apply to your properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${fieldName}-${option}`}
                          checked={form.watch(fieldName as keyof FormValues)?.includes(option)}
                          onCheckedChange={() => handleMultiSelect(fieldName as keyof typeof availableOptions, option)}
                        />
                        <Label htmlFor={`${fieldName}-${option}`} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors[fieldName as keyof FormValues] && (
                    <p className="text-red-500 text-sm mt-2">
                      {String(form.formState.errors[fieldName as keyof FormValues]?.message || '')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Social Media & Marketing
                </CardTitle>
                <CardDescription>
                  Help us showcase your brand (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      {...form.register("Instagram")}
                      placeholder="https://instagram.com/yourcompany"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      {...form.register("Facebook")}
                      placeholder="https://facebook.com/yourcompany"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      {...form.register("LinkedIn")}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input
                      id="tiktok"
                      {...form.register("TikTok")}
                      placeholder="https://tiktok.com/@yourcompany"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube / Video Tour</Label>
                  <Input
                    id="youtube"
                    {...form.register("YouTube / Video Tour")}
                    placeholder="https://youtube.com/yourcompany"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media Uploads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Media Uploads
                </CardTitle>
                <CardDescription>
                  Add visual elements to make your listing stand out (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo">Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    {...form.register("Logo Upload")}
                  />
                </div>
                <div>
                  <Label htmlFor="highlightImage">Highlight Image</Label>
                  <Input
                    id="highlightImage"
                    type="file"
                    accept="image/*"
                    {...form.register("Highlight Image")}
                  />
                </div>
                <div>
                  <Label htmlFor="ratingScreenshot">Rating & Reviews Screenshot</Label>
                  <Input
                    id="ratingScreenshot"
                    type="file"
                    accept="image/*"
                    {...form.register("Rating (X/5) & Reviews (#) Screenshot")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="px-8 py-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    Submit & Proceed to Payment
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-3">
                You'll be redirected to secure payment processing
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
