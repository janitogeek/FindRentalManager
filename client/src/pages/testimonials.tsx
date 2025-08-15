import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState("all");
  const [showAirbnbScreenshot, setShowAirbnbScreenshot] = useState(false);
  const [showDirectScreenshot, setShowDirectScreenshot] = useState(false);

  // Check URL parameters to set initial tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'owners' || tab === 'guests') {
      setActiveTab('owners');
    } else if (tab === 'managers') {
      setActiveTab('managers');
    }
  }, []);
  // Fetch testimonials
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/testimonials", undefined);
      return res.json();
    }
  });

  // Featured testimonial - Christophe M. with savings comparison
  const featuredTestimonial = {
    id: "christophe-m-featured",
    name: "Christophe M.",
    role: "guest",
    location: "Dijon, France",
    property: "Le Diderot - 2 bedrooms - central",
    savings: "13%",
    amountSaved: "€35.17",
    airbnbTotal: "€261.17",
    directTotal: "€226",
    nights: 2,
    review: "I discovered Le Diderot through BookDirectStays directory and booked directly with Zenica's website. The process was seamless and I saved €35.17 compared to Airbnb! The apartment was exactly as described - beautifully furnished, centrally located in Dijon, perfect for our 2-night stay. Booking direct not only saved us money but also gave us direct contact with Domenico for any questions. Highly recommend using BookDirectStays to find these hidden gems!",
    rating: 5
  };

  // Group testimonials by role
  const guestTestimonials = testimonials?.filter((testimonial: any) => testimonial.role === "guest") || [];
  const hostTestimonials = testimonials?.filter((testimonial: any) => testimonial.role === "host") || [];

  // Featured Testimonial Component with Savings Comparison
  const FeaturedTestimonialCard = () => (
    <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-600 text-white font-semibold">CM</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900">{featuredTestimonial.name}</h3>
            <p className="text-sm text-gray-600">{featuredTestimonial.location}</p>
          </div>
          <div className="ml-auto">
            <div className="flex">
              {Array.from({ length: featuredTestimonial.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">★</span>
              ))}
            </div>
          </div>
        </div>

        {/* Property & Savings Banner */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-green-800">{featuredTestimonial.property}</h4>
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              Saved {featuredTestimonial.savings}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-red-600 font-semibold">Airbnb Total</div>
              <div className="text-lg font-bold text-red-700">{featuredTestimonial.airbnbTotal}</div>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-semibold">Direct Booking</div>
              <div className="text-lg font-bold text-green-700">{featuredTestimonial.directTotal}</div>
            </div>
          </div>
          <div className="text-center mt-2 text-green-800 font-semibold">
            💰 Saved {featuredTestimonial.amountSaved} for {featuredTestimonial.nights} nights
          </div>
        </div>

        {/* Review Text */}
        <p className="text-gray-700 leading-relaxed mb-4">
          "{featuredTestimonial.review}"
        </p>

        {/* Screenshot Buttons */}
        <div className="flex space-x-3">
          <Button 
            onClick={() => setShowAirbnbScreenshot(true)}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            📱 Airbnb Screenshot
          </Button>
          <Button 
            onClick={() => setShowDirectScreenshot(true)}
            variant="outline"
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            📱 Direct Booking Screenshot
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Testimonials</h1>
        <p className="text-gray-600 mb-8 text-center">
          See what our community of property owners and property managers are saying about BookDirectStays.com
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="w-full mb-8 max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="owners">Property Owners</TabsTrigger>
            <TabsTrigger value="managers">Property Managers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {/* Featured Testimonial - Full Width */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">✨ Featured Savings Story</h3>
              <div className="max-w-2xl mx-auto">
                <FeaturedTestimonialCard />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="ml-4">
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                testimonials?.map((testimonial: any) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="owners">
            {/* Featured Testimonial - Full Width */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">✨ Featured Savings Story</h3>
              <div className="max-w-2xl mx-auto">
                <FeaturedTestimonialCard />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="ml-4">
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                guestTestimonials.map((testimonial: any) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="managers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="ml-4">
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                hostTestimonials.map((testimonial: any) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Ready to join our community?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Whether you're a traveler looking for better deals or a property manager wanting to connect directly with guests, BookDirectStays.com is the perfect platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <a className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition">
                Find Direct Booking Sites
              </a>
            </Link>
            <Link href="/submit">
              <a className="bg-white border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition">
                List Your Property
              </a>
            </Link>
          </div>
        </div>

        {/* Airbnb Screenshot Dialog */}
        <Dialog open={showAirbnbScreenshot} onOpenChange={setShowAirbnbScreenshot}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-600">Airbnb Pricing Screenshot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3 text-gray-900">Le Diderot - 2 bedrooms - central</h4>
                <p className="text-red-600 font-bold text-xl mb-4">Total: €261.17 for 2 nights</p>
              </div>
              <img 
                src="/uploads/zenica-direct-le-diderot-screenshot.png"
                alt="Airbnb booking screenshot showing €261.17 total for Le Diderot 2 nights" 
                className="w-full rounded-lg border shadow-lg"
              />
              <p className="text-sm text-gray-600 text-center">
                Real Airbnb booking page showing €261.17 total for Le Diderot apartment
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Direct Booking Screenshot Dialog */}
        <Dialog open={showDirectScreenshot} onOpenChange={setShowDirectScreenshot}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-600">Zenica Direct Booking Screenshot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-3 text-gray-900">Le Diderot - 2 bedrooms - central</h4>
                <p className="text-green-600 font-bold text-xl mb-4">Total: €226.00 for 2 nights</p>
              </div>
              <img 
                src="/uploads/airbnb-le-diderot-screenshot.png"
                alt="Zenica direct website screenshot showing €226.00 for Le Diderot" 
                className="w-full rounded-lg border shadow-lg"
              />
              <p className="text-sm text-gray-600 text-center">
                Real Zenica direct booking website showing €226.00 total for the same property
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h3 className="font-semibold">{testimonial.name}</h3>
            <p className="text-sm text-gray-500">
              {testimonial.role === "guest" ? "Traveler" : "Property Manager"}
            </p>
          </div>
        </div>
        <div className="text-gray-700">"{testimonial.content}"</div>
      </CardContent>
    </Card>
  );
}
