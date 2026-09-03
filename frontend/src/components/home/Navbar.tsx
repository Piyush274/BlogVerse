import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Menu,
  X,
  PenTool,
  Sparkles,
  LayoutDashboard,
  FilePlus,
  LogOut,
  User,
} from "lucide-react";
import ModeToggle from "./ToggleMode";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SearchInput from "./SearchInput";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 h-16">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight hover:opacity-90 transition-opacity group"
          >
            <img
              src="/logo.svg"
              alt="BlogVerse Logo"
              className="h-8 w-8 rounded-lg shadow-sm transition-transform group-hover:scale-105"
            />
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent font-extrabold">
              BlogVerse
            </span>
            <span className="hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ml-1">
              <Sparkles className="h-3 w-3 mr-1" />
              New
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/articles">
              <Button variant="ghost" className="text-sm font-medium">
                Articles
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="text-sm font-medium">
                About
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SearchInput />
          </div>

          <ModeToggle />

          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <Link to="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="gap-1.5 font-medium">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
              </Link>

              {/* User Avatar Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all p-0"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.imageUrl} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-purple-600/20 text-primary font-bold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl shadow-xl border">
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer gap-2 py-2">
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/articles/create" className="cursor-pointer gap-2 py-2">
                      <FilePlus className="h-4 w-4 text-muted-foreground" />
                      <span>Write Article</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Link to="/sign-in">
                <Button variant="outline" size="sm" className="text-sm font-medium">
                  Login
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button
                  size="sm"
                  className="text-sm font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-sm"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 md:hidden py-4 space-y-4 border-t bg-background px-4 shadow-lg">
            {/* Search Bar (Mobile) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as HTMLFormElement;
                const search = (target.elements.namedItem("search") as HTMLInputElement).value;
                setIsMobileMenuOpen(false);
                navigate(search ? `/articles?search=${encodeURIComponent(search)}` : "/articles");
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search articles..."
                  className="pl-10 w-full focus-visible:ring-1"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <div className="space-y-1">
              <Link
                to="/articles"
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/articles/create"
                    className="block px-3 py-2 text-base font-medium rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Article
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-destructive rounded-md hover:bg-destructive/10"
                  >
                    Log Out
                  </button>
                </>
              ) : null}
            </div>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
