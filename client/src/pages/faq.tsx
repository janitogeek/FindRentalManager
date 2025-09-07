import { faqs as staticFaqs } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useMemo } from "react";

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('owner');

  const filteredFAQs = useMemo(() => {
    if (activeTab === 'owner') {
      return staticFaqs.filter(faq => faq.category === 'owner');
    } else if (activeTab === 'manager') {
      return staticFaqs.filter(faq => faq.category === 'manager');
    }
    return staticFaqs;
  }, [activeTab]);

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2 text-center">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              Find answers to common questions about FindRentalManager.com
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="w-full mb-8 max-w-md mx-auto grid grid-cols-2">
              <TabsTrigger value="owner">For Property Owners</TabsTrigger>
              <TabsTrigger value="manager">For Property Managers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="owner">
              {/* Loading skeleton */}
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq: any) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            <TabsContent value="manager">
              {/* Loading skeleton */}
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq: any) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Have more questions?</h2>
            <p className="mb-4">
              If you can't find the answer you're looking for, please contact our support team or
              consider listing your management company in our directory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/submit">
                  List Your Management Company
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <a href="mailto:findmyrentalmanager@gmail.com">
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
}
