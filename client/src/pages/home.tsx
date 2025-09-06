import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeaturedHostsCarousel from "@/components/featured-hosts-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedPage, { AnimatedSection } from "@/components/animated-page";
import { buttonVariants, fadeInUpVariants, fadeInLeftVariants, fadeInRightVariants } from "@/lib/animations";

export default function Home() {
  const [, setLocation] = useLocation();
 
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
            backgroundImage: "url('/findrentalmanager.png')"
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
                  className="w-full py-2 px-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xl text-sm font-semibold flex items-center justify-center gap-2"
                >
                  Find a Manager Now!
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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

      {/* Why Hire a Property Manager Section - 4 Pillars */}
      <AnimatedSection className="py-20 bg-gray-50" delay={0.2}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Hire a Property Manager?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional property management delivers measurable results that transform your rental business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center group hover:bg-white p-8 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn More</h3>
              <p className="text-gray-600 text-sm">~35% higher revenue on average vs. self-management</p>
            </div>

            <div className="text-center group hover:bg-white p-8 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Book More</h3>
              <p className="text-gray-600 text-sm">Occupancy up to 90% vs. 50–70% DIY</p>
            </div>

            <div className="text-center group hover:bg-white p-8 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Work Less</h3>
              <p className="text-gray-600 text-sm">Save 20+ hrs/month on guest comms & operations</p>
            </div>

            <div className="text-center group hover:bg-white p-8 rounded-2xl transition-colors">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scale Faster</h3>
              <p className="text-gray-600 text-sm">Easily manage 2–10+ properties with pro support</p>
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
      <section className="py-20 bg-gray-25"
        style={{ backgroundColor: '#fefefe' }}
      >
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
               className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-2"
             >
               Start Finding Managers
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
             </Button>
           </div>
         </div>
       </section>
      </main>
    </AnimatedPage>
  );
}
