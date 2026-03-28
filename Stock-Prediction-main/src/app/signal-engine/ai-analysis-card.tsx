import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface AIAnalysisCardProps {
    analysis: string;
}

export default function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" />
                    <span>AI Reasoning</span>
                </CardTitle>
                <CardDescription>The AI's explanation for the generated signal.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis}</p>
            </CardContent>
        </Card>
    );
}
