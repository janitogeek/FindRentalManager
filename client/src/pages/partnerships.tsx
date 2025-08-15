import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Partnerships() {
  const [, setLocation] = useLocation();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Partner with FindRentalManager
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              Join the movement transforming property management - empowering direct connections between property owners and rental managers worldwide
            </p>
            <div className="flex justify-center">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Partnership
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section id="why-partner" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Partner With BookDirectStays?
            </h2>
            <p className="text-xl text-gray-600">
              We are building the world's largest direct booking ecosystem for vacation rental companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rapid Growth</h3>
              <p className="text-gray-600 text-sm">Direct booking demand is booming: 1,000+ verified hosts across 50+ countries and growing every day.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Focus</h3>
              <p className="text-gray-600 text-sm">100% manually reviewed properties ensuring authentic, verified listings</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Impact</h3>
              <p className="text-gray-600 text-sm">Become a partner today and position yourself as a pioneer in the rapidly evolving direct booking market.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Partnership Opportunities
            </h2>
            <p className="text-xl text-gray-600">
              Tailored collaboration models for every stakeholder in the vacation rental ecosystem
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Property Managers */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors flex flex-col h-full">
              <CardHeader className="bg-blue-50">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0H3"/>
                  </svg>
                </div>
                <CardTitle className="text-xl text-blue-900">Property Managers</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 mb-6">
                  Maximize your visibility and drive more direct bookings with our tailored consulting and content creation services.
                </p>
                
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Content Creation for Social Media</h4>
                      <p className="text-sm text-gray-600">Engaging, high-conversion content designed for your socials to showcase your properties and attract guests where they are most active.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Consulting Services</h4>
                      <p className="text-sm text-gray-600">Strategic guidance to increase your direct website's visibility, strengthen your brand, and turn traffic into direct bookings.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Traffic & Click Analytics</h4>
                      <p className="text-sm text-gray-600">Transparent reporting with click and traffic insights so you can track the results of your listing and campaigns in real time.</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-auto" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Partner as Property Manager
                </Button>
              </CardContent>
            </Card>

            {/* Vendors & Tech Providers */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors flex flex-col h-full">
              <CardHeader className="bg-purple-50">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <CardTitle className="text-xl text-purple-900">Vendors & Tech Providers</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 mb-6">
                  Connect with our curated network of property management companies seeking innovative solutions and services.
                </p>
                
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Curated PMC Lists</h4>
                      <p className="text-sm text-gray-600">Access to verified property management companies actively seeking solutions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Lead Generation Programs</h4>
                      <p className="text-sm text-gray-600">Qualified introductions and warm leads to decision-makers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Sponsorship Opportunities</h4>
                      <p className="text-sm text-gray-600">Brand visibility through our platform, newsletters, and industry events</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-auto" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Partner as Tech Provider
                </Button>
              </CardContent>
            </Card>

            {/* Investors */}
            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col h-full">
              <CardHeader className="bg-green-50">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <CardTitle className="text-xl text-green-900">Investors</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 mb-6">
                  Access comprehensive market intelligence and exclusive opportunities in the rapidly growing direct booking sector.
                </p>
                
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Market Data & Analytics</h4>
                      <p className="text-sm text-gray-600">Real-time booking trends, market penetration data, and growth forecasts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">PMC Introductions</h4>
                      <p className="text-sm text-gray-600">Direct access to high-performing property management companies seeking investment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Exclusive Deal Flow</h4>
                      <p className="text-sm text-gray-600">Early access to investment opportunities and industry partnerships</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 mt-auto" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Partner as Investor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Partnership Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real results from our valued partners across the vacation rental ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-lg">SM</span>
                  </div>
                  <div>
                    <blockquote className="text-gray-700 italic mb-4">
                      "BookDirectStays helped us increase our direct bookings by 45% in the first quarter. Their verified platform gives our guests confidence to book directly with us."
                    </blockquote>
                    <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                    <div className="text-sm text-gray-600">Coastal Properties Management</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-lg">DT</span>
                  </div>
                  <div>
                    <blockquote className="text-gray-700 italic mb-4">
                      "The partnership program connected us with over 200 qualified PMCs in 6 months. Our revenue from the vacation rental sector has tripled."
                    </blockquote>
                    <div className="font-semibold text-gray-900">David Thompson</div>
                    <div className="text-sm text-gray-600">TechFlow Solutions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Partner with Us?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join leading companies in the vacation rental industry who are already benefiting from our partnership programs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
              <div className="text-center">
                <div 
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-blue-400 transition-colors"
                  onClick={() => window.open('mailto:bookdirectstays@gmail.com?subject=Partnership Inquiry&body=Hi, I am interested in exploring partnership opportunities with BookDirectStays.', '_blank')}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                <p className="text-blue-100">bookdirectstays@gmail.com</p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-blue-400 transition-colors"
                  onClick={() => window.open('https://wa.me/33769157421?text=Hi, I am interested in exploring partnership opportunities with BookDirectStays.', '_blank')}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
                <p className="text-blue-100">+33 7 69 15 74 21</p>
              </div>
            </div>

            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => window.open('mailto:bookdirectstays@gmail.com?subject=Partnership Inquiry&body=Hi, I am interested in exploring partnership opportunities with BookDirectStays.', '_blank')}
            >
              Start Partnership Discussion
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
} 