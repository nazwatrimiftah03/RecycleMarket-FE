import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

const summaryData = [
  { title: "Total Projects", value: "24", description: "8 active this month", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50", progress: 75 },
  { title: "Completed Tasks", value: "187", description: "23 completed today", icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50", progress: 92 },
  { title: "In Progress", value: "42", description: "15 due this week", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50", progress: 60 },
  { title: "Pending Review", value: "8", description: "Needs attention", icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-50", progress: 33 },
];

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-gray-600">{item.title}</CardTitle>
              <div className={`${item.bgColor} ${item.color} p-2 rounded-lg`}>
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 mb-1">{item.value}</div>
              <p className="text-gray-500 mb-3">{item.description}</p>
              <Progress value={item.progress} className="h-2" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
