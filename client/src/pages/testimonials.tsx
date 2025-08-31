import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState("all");

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

  // Group testimonials by role
  const guestTestimonials = testimonials?.filter((testimonial: any) => testimonial.role === "guest") || [];
  const hostTestimonials = testimonials?.filter((testimonial: any) => testimonial.role === "host") || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Testimonials</h1>
        <p className="text-gray-600 mb-8 text-center">
          See what our community of property owners and rental managers are saying about FindRentalManager.com
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="w-full mb-8 max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="owners">Property Owners</TabsTrigger>
            <TabsTrigger value="managers">Rental Managers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
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
            {/* Featured Success Stories Header */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">✨ Featured Success Stories</h3>
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
            Whether you're a property owner looking for trusted management or a rental manager wanting to connect with more property owners, FindRentalManager.com is the perfect platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/find-manager">
              <a className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition">
                Find a Manager
              </a>
            </Link>
            <Link href="/submit">
              <a className="bg-white border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition">
                List Your Company
              </a>
            </Link>
          </div>
        </div>
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
              {testimonial.role === "guest" ? "Property Owner" : "Rental Manager"}
            </p>
          </div>
        </div>
        <div className="text-gray-700">"{testimonial.content}"</div>
      </CardContent>
    </Card>
  );
}