import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getTopCountriesWithCounts, getTopCitiesWithCounts } from "@/lib/submission-processor";
import { slugify } from "@/lib/utils";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch top destinations data
  const { data: topCountries = [] } = useQuery({
    queryKey: ["/api/top-countries"],
    queryFn: () => getTopCountriesWithCounts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: topCities = [] } = useQuery({
    queryKey: ["/api/top-cities"],
    queryFn: () => getTopCitiesWithCounts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/subscribe", { email });
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BookDirectStays.com</h3>
            <p className="text-gray-300 mb-4">
              Connect directly with professional hosts worldwide and skip the middleman fees.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/find-manager" className="text-gray-300 hover:text-white">
                  Find a Manager
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-300 hover:text-white">
                  List Your Management Company
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="text-gray-300 hover:text-white">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-white">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Countries</h3>
            <ul className="space-y-2">
              {topCountries.slice(0, 5).map((country) => (
                <li key={country.name}>
                  <Link 
                    href={`/country/${slugify(country.name)}`} 
                    className="text-gray-300 hover:text-white"
                  >
                    {country.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Cities</h3>
            <ul className="space-y-2">
              {topCities.slice(0, 5).map((city) => (
                <li key={`${city.name}-${city.country}`}>
                  <Link 
                    href={`/country/${slugify(city.country)}/${slugify(city.name)}`} 
                    className="text-gray-300 hover:text-white"
                  >
                    <div className="text-sm">{city.name}</div>
                    <div className="text-xs text-gray-400">{city.country}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <a href="mailto:bookdirectstays@gmail.com" className="flex items-start text-gray-300 hover:text-white transition-colors">
                  <i className="fas fa-envelope mt-1 mr-2"></i>
                  <span>bookdirectstays@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start">
                <a href="https://api.whatsapp.com/send/?phone=33769157421&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="flex items-start text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-whatsapp mt-1 mr-2"></i>
                  <span>+33 7 69 15 74 21</span>
                </a>
              </li>
            </ul>
            
            <form onSubmit={handleSubscribe} className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Join our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-3 py-2 text-gray-800 rounded-l-md focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-r-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : "Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            &copy; 2025 BookDirectStays.com. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white mr-4">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white mr-4">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
