import { Search, Plus, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white">D</span>
              </div>
              <span className="text-gray-900">Dashboard</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-900 hover:text-gray-600 transition-colors">Overview</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Projects</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Analytics</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Reports</a>
            </div>
          </div>

          {/* Search, New Project, and Avatar */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input type="search" placeholder="Search..." className="pl-9 w-64" />
            </div>

            <Button className="gap-2">
              <Plus className="size-4" />
              <span className="hidden sm:inline">New Project</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p>John Doe</p>
                    <p className="text-gray-500">john.doe@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
