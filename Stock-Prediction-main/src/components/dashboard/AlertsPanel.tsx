import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const alerts = [
    { icon: '🚀', text: "NVDA hits new all-time high.", time: "2m ago" },
    { icon: '⚠️', text: "High volatility detected in TSLA.", time: "15m ago" },
    { icon: '🔻', text: "MSFT signal downgraded to HOLD.", time: "1h ago" },
    { icon: '📈', text: "Portfolio value increased by 1.5% in the last hour.", time: "1h ago"},
];

export default function AlertsPanel() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <span>Live Alerts</span>
                </CardTitle>
                <CardDescription>Real-time notifications from your AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="text-lg mt-[-2px]">{alert.icon}</div>
                        <div className="flex-grow">
                            <p className="text-sm leading-snug">{alert.text}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
