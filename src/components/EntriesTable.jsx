import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const entries = [
  { id: "PRJ-001", name: "Website Redesign", status: "In Progress", assignee: { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop", initials: "SJ" }, priority: "High", dueDate: "Dec 15, 2024", progress: 65 },
  { id: "PRJ-002", name: "Mobile App Development", status: "In Progress", assignee: { name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop", initials: "MC" }, priority: "High", dueDate: "Dec 20, 2024", progress: 45 },
  { id: "PRJ-003", name: "Database Migration", status: "Pending", assignee: { name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop", initials: "ER" }, priority: "Medium", dueDate: "Dec 10, 2024", progress: 20 },
  { id: "PRJ-004", name: "Marketing Campaign", status: "Completed", assignee: { name: "David Park", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop", initials: "DP" }, priority: "Low", dueDate: "Nov 28, 2024", progress: 100 },
  { id: "PRJ-005", name: "API Integration", status: "In Progress", assignee: { name: "Lisa Anderson", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=32&h=32&fit=crop", initials: "LA" }, priority: "High", dueDate: "Dec 12, 2024", progress: 80 },
  { id: "PRJ-006", name: "User Testing Phase 2", status: "Pending", assignee: { name: "James Wilson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop", initials: "JW" }, priority: "Medium", dueDate: "Dec 18, 2024", progress: 10 },
];

const statusColors = {
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

const priorityColors = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-orange-50 text-orange-700 border-orange-200",
  Low: "bg-gray-50 text-gray-700 border-gray-200",
};

export function EntriesTable() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-gray-900">Recent Projects</h2>
        <p className="text-gray-600 mt-1">A list of all projects including their status and progress.</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" className="gap-1 px-0 hover:bg-transparent">
                  Project
                  <ArrowUpDown className="size-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-gray-900">{entry.name}</div>
                    <div className="text-gray-500">{entry.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[entry.status]}>
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.assignee.avatar} alt={entry.assignee.name} />
                      <AvatarFallback>{entry.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900">{entry.assignee.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={priorityColors[entry.priority]}>
                    {entry.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{entry.dueDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${entry.progress}%` }} />
                    </div>
                    <span className="text-gray-600">{entry.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit project</DropdownMenuItem>
                      <DropdownMenuItem>Change status</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
