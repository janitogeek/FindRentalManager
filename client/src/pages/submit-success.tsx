import { useEffect, useState } from "react";
import { useSearch } from "wouter";

export default function SubmitSuccess() {
  const [search] = useSearch();
  const [isProcessing, setIsProcessing] = useState(true);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    const processSubmission = async () => {
      try {
        // Get form data from localStorage
        const formData = JSON.parse(localStorage.getItem('submissionFormData') || '{}');
        
        // Get session ID and plan from URL
        const urlParams = new URLSearchParams(search);
        const sessionId = urlParams.get('session_id');
        const plan = urlParams.get('plan');

        if (!sessionId || !plan) {
          throw new Error('Missing session information');
        }

        // Verify payment with Stripe and submit to Airtable
        const paymentResponse = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, plan, formData })
        });

        if (!paymentResponse.ok) {
          throw new Error('Payment verification failed');
        }

        const result = await paymentResponse.json();
        setSubmissionResult(result);
        
        // Clear form data from localStorage
        localStorage.removeItem('submissionFormData');
        
      } catch (error) {
        console.error('Submission processing error:', error);
        setSubmissionResult({ error: 'Submission failed' });
      } finally {
        setIsProcessing(false);
      }
    };

    processSubmission();
  }, [search]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Processing Your Submission</h1>
          <p className="text-gray-600">Please wait while we save your information...</p>
        </div>
      </div>
    );
  }

  if (submissionResult?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Submission Failed</h1>
          <p className="text-gray-600">{submissionResult.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Submission Successful!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for submitting your listing. Your information has been saved and will be reviewed shortly.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">What Happens Next?</h2>
          <ul className="text-green-700 space-y-2">
            <li>• Your listing is now in our review queue</li>
            <li>• We'll review your submission within 24-48 hours</li>
            <li>• Once approved, your listing will appear on our website</li>
            <li>• You'll receive an email confirmation</li>
          </ul>
        </div>

        <div className="space-y-4">
          <a 
            href="/" 
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Homepage
          </a>
          <a 
            href="/find-manager" 
            className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors ml-4"
          >
            Browse Other Listings
          </a>
        </div>
      </div>
    </div>
  );
}