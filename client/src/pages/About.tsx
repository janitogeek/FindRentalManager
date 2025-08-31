import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function About() {
  const [, setLocation] = useLocation();

  // SEO: Add structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "FindRentalManager",
      "url": "https://findrentalmanager.com",
      "sameAs": [
        "https://www.linkedin.com/in/jan-sahagun-escosa/",
        "https://www.linkedin.com/in/elsa-ibos/"
      ],
      "founder": [
        {
          "@type": "Person",
          "name": "Jan Sahagun",
          "jobTitle": "Founder",
          "description": "Property tech professional and rental management expert",
          "sameAs": "https://www.linkedin.com/in/jan-sahagun-escosa/"
        },
        {
          "@type": "Person",
          "name": "Elsa Ibos",
          "jobTitle": "Co-Founder",
          "description": "Strategic Planner, Brand Strategist and Content Creator",
          "sameAs": "https://www.linkedin.com/in/elsa-ibos/"
        }
      ]
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              About FindRentalManager
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              The Global Directory for Trusted Vacation Rental Management
            </p>
            <p className="text-lg mb-8 opacity-90">
              Finally sleep better at night. Discover vetted professional rental managers across 50+ countries. We help you find legitimate companies with good reviews, professional systems, and direct booking websites - but you make the final decisions about your investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => setLocation("/find-host")}
              >
                Find Your Manager
              </Button>
              <Button 
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
                onClick={() => setLocation("/submit")}
              >
                List Your Company
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center animate-fade-in">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-500 animate-slide-up">
                <div className="space-y-12">
                  {/* 🏠 The Property Owner's Dilemma - Left-aligned */}
                  <div className="text-left hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🏠 The Property Owner's Dilemma</h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      Owning vacation rental properties should be rewarding, not stressful. Yet countless property owners lie awake wondering: Is my manager really maximizing revenue? Are they maintaining my property properly? Can I trust them with my most valuable investment?
                    </p>
                  </div>
                  
                  {/* 💸 The Hidden Cost of Bad Management - Right-aligned */}
                  <div className="text-right hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">💸 The Hidden Cost of Bad Management</h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      Working in property tech, I've seen it all: managers who pocket maintenance funds, inflate expenses, provide zero transparency, or simply don't care about your ROI. The wrong manager can cost you thousands in lost revenue and property damage.
                    </p>
                  </div>
                  
                  {/* 🔍 The Search & Ranking Problem - Left-aligned */}
                  <div className="text-left hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🔍 The Search & Ranking Problem</h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      Finding trustworthy rental managers is nearly impossible. Most operate through word-of-mouth or have websites that struggle to rank well in search engines due to limited SEO resources, local competition, and algorithm changes. Even professional managers with excellent service often remain invisible online, making it hard for property owners to discover them.
                    </p>
                  </div>
                  
                  {/* ✅ The Solution: FindRentalManager - Right-aligned */}
                  <div className="text-right hover:scale-105 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">✅ The Solution: FindRentalManager</h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      That's why I created FindRentalManager. A curated directory where rental management companies are carefully vetted for legitimacy - we check they have decent reviews, use professional PMS systems, maintain direct booking websites, and demonstrate serious business practices. We don't guarantee outcomes, but we help property owners discover legitimate professionals who might otherwise remain hidden in search results.
                    </p>
                  </div>
                  
                  {/* 🌟 Bridge the Visibility Gap - Centered (Highlighted) */}
                  <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200 hover:shadow-xl transition-all duration-500 hover:scale-105">
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">🌟 Bridge the Visibility Gap</h3>
                    <p className="text-xl leading-relaxed text-gray-700 max-w-4xl mx-auto">
                      With my co-founder Elsa, we're building more than a directory - we're creating a bridge between quality managers and property owners. We carefully vet companies for legitimacy, professionalism, and basic business standards, then help them overcome the visibility challenges they face in search engines. It's about connecting the right people, not making promises about outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 animate-fade-in">
              Who We Are
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Team Photo */}
            <div className="text-center mb-12">
              <img 
                src="/uploads/elsa-jan-profile.jpg" 
                alt="Elsa and Jan - FindRentalManager Founders"
                className="w-80 h-80 rounded-2xl mx-auto shadow-lg object-cover"
              />
            </div>

            {/* Team Descriptions with Professional Boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Elsa - Co-Founder (Left Box) */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="/uploads/elsa-profile.jpg" 
                      alt="Elsa Ibos"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Elsa Ibos</h3>
                  <p className="text-purple-600 font-semibold text-lg">Co-Founder</p>
                </div>
                <p className="text-gray-700 text-base leading-relaxed text-center mb-6">
                  Strategic Planner, Brand Strategist and Content Creator (5+ years). Elsa leads our verification process and partnerships with professional rental management companies worldwide.
                </p>
                <div className="text-center">
                  <Button 
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                    onClick={() => window.open('https://www.linkedin.com/in/elsa-ibos/', '_blank')}
                  >
                    View LinkedIn
                  </Button>
                </div>
              </div>

              {/* Jan - Founder (Right Box) */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="/uploads/jan-profile.jpg" 
                      alt="Jan Sahagun"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Jan Sahagun</h3>
                  <p className="text-blue-600 font-semibold text-lg">Founder</p>
                </div>
                <p className="text-gray-700 text-base leading-relaxed text-center mb-6">
                  Property tech professional and rental management expert dedicated to connecting property owners with trustworthy managers. Worked with 100+ management companies across 6 continents.
                </p>
                <div className="text-center">
                  <Button 
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={() => window.open('https://www.linkedin.com/in/jan-sahagun-escosa/', '_blank')}
                  >
                    View LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory + Partnerships Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
              Directory + Partnerships
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Smart Investment in Dual Visibility</h3>
                <p className="text-blue-800 mb-4">
                  <strong>List your management company on 2 websites for just €99.99/year</strong> - that's less than €0.28 per day, or roughly the cost of a coffee. Get listed on FindRentalManager.com AND{' '}
                  <a href="https://bookdirectstays.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-semibold">
                    BookDirectStays.com
                  </a>
                  {' '}to reach both property owners seeking managers and travelers seeking direct bookings.
                  <span className="text-blue-600 text-sm block mt-1">*Vetting process and dual-website maintenance require this investment</span>
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🚀 Partnership Opportunities to Scale Your Business</h3>
                <p className="text-purple-800 mb-4">
                  Beyond basic listing, unlock premium growth opportunities designed specifically for rental management companies:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📱</span>
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-2">Brand Authority Building</h4>
                    <p className="text-sm text-purple-700">Elsa creates engaging content & campaigns to establish your company as the trusted local expert</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-2">Premium Placement</h4>
                    <p className="text-sm text-purple-700">Featured visibility and enhanced profiles to attract high-value property owners</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-2">Growth Consulting</h4>
                    <p className="text-sm text-purple-700">Tailored business development services to help you scale operations and win more property owners</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setLocation("/partnerships")}
                >
                  🚀 Explore Partnership Opportunities
                </Button>
                <p className="text-gray-500 text-sm mt-2">Discover how we can help you attract more property owners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                🌍 Our Global Vision for Property Management
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We believe every property owner deserves access to professional, trustworthy rental management across all continents and property types
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Vision Statement */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Transforming Property Owner Confidence Worldwide
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Protected Investments</h4>
                      <p className="text-gray-600">Property owners sleep better knowing their investments are managed by verified professionals across Europe, North America, Asia-Pacific, Latin America, Africa, and Oceania</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Maximized Revenue</h4>
                      <p className="text-gray-600">Professional managers increase property revenue by 20-40% through expert pricing, marketing, and operational excellence</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Transparency & Trust</h4>
                      <p className="text-gray-600">Clear reporting, verified credentials, and proven track records create confidence in the rental management relationship</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Global Network of Professionals</h4>
                      <p className="text-gray-600">Connecting property owners with vetted management companies worldwide through our curated directory</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Coverage Visual */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  🌍 Global Coverage & Property Types
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🇪🇺</span>
                      <span className="font-medium">Europe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🌎</span>
                      <span className="font-medium">North America</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🌏</span>
                      <span className="font-medium">Asia-Pacific</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🏖️</span>
                      <span className="font-medium">Latin America</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🌍</span>
                      <span className="font-medium">Africa</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">🦘</span>
                      <span className="font-medium">Oceania</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-center text-gray-600 text-sm">
                    <strong>Property Types:</strong> Villas, Apartments, Cabins, Chalets, Condos, Beach Houses, Mountain Retreats, Urban Lofts, Luxury Estates
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-center text-gray-600 text-sm">
                    Whether you own a villa in Greece, a cabin in Canada, an apartment in Paris, or a beach house in Mexico, FindRentalManager connects you with verified professional managers who'll protect and grow your investment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Sleep Better at Night?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of property owners who've discovered the peace of mind that comes with professional management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => setLocation("/find-host")}
              >
                Find Your Manager
              </Button>
              <Button 
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
                onClick={() => setLocation("/submit")}
              >
                List Your Company
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600">
              All management companies go through our vetting process checking for legitimacy, reviews, professional systems, and direct booking websites before listing. We don't guarantee or endorse any specific outcomes. If you see an issue or outdated information, contact us at{' '}
              <a href="mailto:findrentalmanager@gmail.com" className="text-blue-600 hover:underline">
                findrentalmanager@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
