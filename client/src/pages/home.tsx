import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeaturedHostsCarousel from "@/components/featured-hosts-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedPage, { AnimatedSection } from "@/components/animated-page";
import { buttonVariants, fadeInUpVariants, fadeInLeftVariants, fadeInRightVariants } from "@/lib/animations";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showAirbnbScreenshot, setShowAirbnbScreenshot] = useState(false);
  const [showDirectScreenshot, setShowDirectScreenshot] = useState(false);
 
  // Quotes carousel state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  // All expert quotes in the specified order
  const expertQuotes = [
    {
      quote: "OTAs are great for browsing options, but once you've found a place you love, consider contacting the host or hotel directly – your wallet and your travel experience will likely benefit.",
      source: "Travel Weekly",
      description: "Guest advocacy article on #BookDirect benefits",
      initials: "TW",
      color: "blue"
    },
    {
      quote: "67% of travelers say they find it cheaper and easier to book on a brand's own site than through an OTA.",
      source: "iPropertyManagement",
      description: "Vacation Rental Statistics",
      initials: "IP",
      color: "green"
    },
    {
      quote: "Hosts and property managers are under pressure from many angles… Increasing direct bookings offers them one way to ease some of these challenges, while delivering better value to guests.",
      source: "Alex Vuilleumier, COO of Lodgify",
      description: "Lodgify 2024 Industry Report",
      initials: "AV",
      color: "purple"
    },
    {
      quote: "All bookings are valuable, but all are not equally valuable.",
      source: "Amy Hinote",
      description: "VRM Intel – Direct Booking Value Analysis",
      initials: "AH",
      color: "orange"
    },
    {
      quote: "By cutting out the OTA, the guest saved £300 and the owner earned £210 more. Direct guests are typically more loyal and likely to return.",
      source: "Zeevou Case Study",
      description: "Lovelady Shield Cottage",
      initials: "Z",
      color: "red"
    },
    {
      quote: "By tapping into a broader range of booking platforms, [hosts] are positioning themselves to adapt to evolving traveler preferences and drive more bookings – a trend we expect will continue….",
      source: "Lodgify 2024 Industry Report",
      description: "Industry Trends Analysis",
      initials: "L",
      color: "indigo"
    },
    {
      quote: "Guests and hosts alike are seeking out better value and customer service.",
      source: "Lodgify 2024 Industry Report",
      description: "Market Analysis",
      initials: "L",
      color: "teal"
    },
    {
      quote: "Direct bookings help hosts regain control over the guest experience and deliver better value.",
      source: "Lodgify Industry Insights",
      description: "Strategic Recommendations",
      initials: "L",
      color: "cyan"
    }
  ];

  // Auto-advance carousel every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % expertQuotes.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [expertQuotes.length]);

  // Navigation functions
  const goToNextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % expertQuotes.length);
  };

  const goToPreviousQuote = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + expertQuotes.length) % expertQuotes.length);
  };

  const goToQuote = (index: number) => {
    setCurrentQuoteIndex(index);
  };

  // Color mapping function for Tailwind CSS
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' }
    };
    return colorMap[color] || colorMap.blue;
  };


  return (
    <AnimatedPage key="home">
      <main className="min-h-screen">
        {/* Hero Section - Clean and Spacious */}
        <AnimatedSection className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect Rental Manager
            </h1>
            <p className="text-3xl lg:text-4xl mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold">Earn 35% More,</span> 
              <span className="text-white"> Stress 100% Less</span>
            </p>
            <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto font-medium">
              Connect directly with professional rental managers worldwide for better occupancy rates, more flexibility, and personalized property management
            </p>
            
            {/* Find a Manager Button - Smaller */}
            <motion.div 
              className="relative max-w-xs mx-auto mb-8"
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  onClick={() => setLocation("/find-manager")}
                  className="w-full py-2 px-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xl text-sm font-semibold"
                >
                  Find a Manager Now!
                </Button>
              </motion.div>
            </motion.div>

            {/* Key Benefits - Clean Cards - Updated */}
            <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-blue-200 mb-1">1000+</div>
                  <div className="text-xs font-medium">Verified Professional Managers</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-blue-200 mb-1">50+</div>
                  <div className="text-xs font-medium">Countries</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </AnimatedSection>

      {/* Real Savings Section - Skol Example - Updated */}
      <AnimatedSection className="py-20 bg-white" delay={0.4}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                💸 Real Results, Real Management
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
                See actual results from professional management vs self-management with real properties
              </p>
              <div className="text-lg font-semibold text-gray-800 mb-2 underline">
                Real Use Case:
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-2">
                <span className="text-blue-600">Property:</span> Skol Apartments Marbella, <span className="text-blue-600">Country:</span> 🇪🇸 Spain | <span className="text-blue-600">Unit:</span> Skol 927A, <span className="text-blue-600">Dates:</span> Sep 3rd to Sep 8th 2025
              </div>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
              {/* OTA Booking */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 flex flex-col">
                <div className="text-center mb-6">
                  <div className="inline-block bg-red-100 px-4 py-2 rounded-full mb-4">
                    <span className="text-red-700 font-semibold">❌ Airbnb (OTA)</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Owner receives</span>
                    <span className="text-red-600">€1,434</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Owner pays OTA commission fees (15%)</span>
                    <span className="font-semibold text-red-600">€253</span>
                  </div>
                </div>
                
                <div className="text-center mt-auto">
                  <Button 
                    onClick={() => setShowAirbnbScreenshot(true)}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100 text-sm px-4 py-2"
                  >
                    📸 View Proof
                  </Button>
                </div>
              </div>

              {/* Direct Booking */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 flex flex-col">
                <div className="text-center mb-6">
                  <div className="inline-block bg-green-100 px-4 py-2 rounded-full mb-4">
                    <span className="text-green-700 font-semibold">✅ Book Direct</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Owner receives</span>
                    <span className="text-green-600">€1,287.5</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="line-through text-gray-400">Owner pays OTA commission fees (15%)</span>
                      <span className="line-through text-gray-400 font-semibold">€193</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-green-600 font-medium">Owner pays no commission fees</span>
                    <span className="font-semibold text-green-600">€0</span>
                  </div>
                  </div>
                </div>
                
                <div className="text-center mt-auto">
                  <Button 
                    onClick={() => setShowDirectScreenshot(true)}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-100 text-sm px-4 py-2"
                  >
                    📸 View Proof
                  </Button>
                </div>
              </div>
            </div>

            {/* Savings Summary */}
            <div className="text-center mt-12">
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Owner Savings */}
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">€146.5 - 10%</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">Owner's Additional Income</div>
                  <div className="text-green-600 font-medium">Professional Management vs Airbnb (OTA)</div>
                </div>
                
                {/* Owner Benefits */}
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">0%</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">Owner Fees with Management</div>
                  <div className="text-green-600 font-medium">vs 15%+ via OTA</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-6 max-w-2xl mx-auto">
                *Real data comparison: Skol 927A on Airbnb vs professional management. Owners receive 10% more income (€146.5 additional), pay 0% fees vs 15%+ commission to OTAs.
              </p>
              
              {/* See Other Examples CTA */}
              <div className="text-center mt-8">
                <Button 
                  onClick={() => setLocation("/testimonials?tab=owners")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-semibold"
                >
                  📊 See Other Examples
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Hosts Carousel Section */}
      <section id="our-featured-hosts" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedHostsCarousel />
          
          {/* Custom Navigation Controls - Added Below Carousel */}
          <div className="flex justify-center space-x-4 mt-6">
            <button 
              onClick={() => {
                // Use the exposed carousel navigation method
                if ((window as any).featuredHostsCarousel) {
                  (window as any).featuredHostsCarousel.goToPrevious();
                }
              }}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => {
                // Use the exposed carousel navigation method
                if ((window as any).featuredHostsCarousel) {
                  (window as any).featuredHostsCarousel.goToNext();
                }
              }}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* What the Experts Say Section - Carousel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What the Experts Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Industry insights and research on the benefits of direct booking
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 relative">
              {/* Quote Carousel */}
              <div className="text-center">
                <div className="text-4xl mb-6">💬</div>
                
                {/* Quote Content */}
                <div className="min-h-[200px] flex items-center justify-center mb-8">
                  <blockquote className="text-lg lg:text-xl font-light text-gray-700 italic leading-relaxed max-w-3xl">
                    {expertQuotes[currentQuoteIndex].quote}
                  </blockquote>
                    </div>
                
                {/* Source */}
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(expertQuotes[currentQuoteIndex].color).bg}`}>
                    <span className={`font-semibold text-sm ${getColorClasses(expertQuotes[currentQuoteIndex].color).text}`}>
                      {expertQuotes[currentQuoteIndex].initials}
                    </span>
                    </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{expertQuotes[currentQuoteIndex].source}</div>
                    <div className="text-gray-600 text-sm">{expertQuotes[currentQuoteIndex].description}</div>
                  </div>
                </div>
                
                {/* Navigation Dots */}
                <div className="flex justify-center space-x-2 mb-6">
                  {[...Array(expertQuotes.length)].map((_, i) => (
                    <button
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i === currentQuoteIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      onClick={() => goToQuote(i)}
                    />
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <div className="flex justify-center space-x-4">
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" onClick={goToPreviousQuote}>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" onClick={goToNextQuote}>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

             {/* CTA Section - Clean and Focused */}
       <section className="py-20 bg-blue-600">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
               Ready to Find Your Perfect Rental Manager?
             </h2>
             <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
               Join thousands of property owners who increase their rental income by 35% on average with professional management services.
             </p>
             <Button 
               onClick={() => setLocation("/find-manager")}
               className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-semibold"
             >
               Start Finding Managers
             </Button>
           </div>
         </div>
       </section>



      {/* Airbnb Screenshot Dialog */}
      <Dialog open={showAirbnbScreenshot} onOpenChange={setShowAirbnbScreenshot}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Airbnb Pricing Screenshot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Skol 927A - Sep 3rd to Sep 8th 2025</h4>
              <p className="text-red-600 font-bold text-xl mb-4">Owner receives: €1,434.00</p>
            </div>
            <img 
              src="/uploads/airbnb-skol-927a-screenshot.png"
              alt="Airbnb booking screenshot showing €1,687 total for Skol 927A Sep 3-8 2025" 
              className="w-full rounded-lg border shadow-lg"
            />
            <p className="text-sm text-gray-600 text-center">
              Real Airbnb booking page showing €1,687.00 total, owner receives €1,434.00 after 15% commission
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Professional Management Screenshot Dialog */}
      <Dialog open={showDirectScreenshot} onOpenChange={setShowDirectScreenshot}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">Professional Management Screenshot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Skol 927A - Sep 3rd to Sep 8th 2025</h4>
              <p className="text-green-600 font-bold text-xl mb-4">Owner receives: €1,287.50</p>
            </div>
            <img 
              src="/uploads/skol-direct-927a-screenshot.png"
              alt="Professional management screenshot showing €1,287.50 total for same listing Sep 3-8 2025" 
              className="w-full rounded-lg border shadow-lg"
            />
            <p className="text-sm text-gray-600 text-center">
              Real professional management website showing €1,287.50 total for the same property
            </p>
          </div>
        </DialogContent>
      </Dialog>
      </main>
    </AnimatedPage>
  );
}
