import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WhyBookWithProps {
  companyName: string;
  content: string;
}

export default function WhyBookWith({ companyName, content }: WhyBookWithProps) {
  if (!content) {
    return null;
  }
  
  return (
    <Card className="mb-8 shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <CardTitle className="text-xl font-semibold">
          Why Rent With {companyName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700">
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}