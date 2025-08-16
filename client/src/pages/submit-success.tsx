import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

export default function SubmitSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    // Get session_id and plan from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = urlParams.get('session_id');
    const planFromUrl = urlParams.get('plan');
    
    setSessionId(sessionIdFromUrl);
    setPlan(planFromUrl);
  }, []);

  const isPremium = plan === "Premium (€499.99/year)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center shadow-xl">
          <CardHeader>
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-700 mb-2">
              Payment Successful! 🎉
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Thank you for your subscription to FindRentalManager!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-gray-700">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-800 mb-3 text-lg">
                  {isPremium ? "🎯 Premium Listing Activated!" : "📋 Basic Listing Submitted!"}
                </h3>
                <ul className="text-left text-blue-700 space-y-2 text-sm">
                  {isPremium ? (
                    <>
                      <li>• ✅ Your listing is <strong>automatically approved</strong> and published!</li>
                      <li>• 🚀 Your listing will appear on the site immediately</li>
                      <li>• ⭐ You get priority placement in search results</li>
                      <li>• 📈 Enhanced visibility with featured badge</li>
                      <li>• 🎯 Access to premium marketing support</li>
                    </>
                  ) : (
                    <>
                      <li>• 📝 Your listing has been submitted for review</li>
                      <li>• ⏰ Review process takes 24-48 hours</li>
                      <li>• 📧 You'll receive an email confirmation shortly</li>
                      <li>• 🔍 Once approved, your listing will appear on the site</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-green-800 mb-2">💼 Dual Platform Visibility</h4>
                <p className="text-green-700 text-sm">
                  Your listing will also appear on <strong>BookDirectStays.com</strong> to boost visibility among travelers, 
                  helping you generate more direct bookings and property management leads!
                </p>
              </div>

              {sessionId && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">
                    Session ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{sessionId}</code>
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setLocation("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                🏠 Return to Home
              </Button>
              
              <Button 
                onClick={() => setLocation("/submit")}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
              >
                ➕ Submit Another Listing
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? Contact us at{" "}
                <a 
                  href="mailto:bookdirectstays@gmail.com" 
                  className="text-blue-600 hover:underline"
                >
                  bookdirectstays@gmail.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}