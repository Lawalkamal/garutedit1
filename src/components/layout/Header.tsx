import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ShoppingCart, Menu, X, User, Wrench } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    
  ];

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className=" sticky top-0 z-50 bg-white ">
      <div className="container mx-auto px-4 ">
        <div className="flex items-center justify-between h-16 ">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-lift">
            <img
              src="src\assets\kaymu-cover-scaled.png"
              alt="AutoParts Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-accent">
              {/* Dropdown for Categories */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium text-black transition-colors hover:text-primary">
              Categories
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to="/shop?category=Car%20Parts">Car Parts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/shop?category=Garage%20Tools">Garage Tools</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/shop?category=Oils%20and%20Fluids">Oils &amp; Fluids</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/shop?category=Tyres">Tyres</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/shop?category=Accessories">Accessories</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActiveLink(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-black"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search auto parts..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 ">
            {/* Search Icon - Mobile */}
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Account */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover-glow-red"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden "
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border ">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search auto parts..."
                    className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
                   <DropdownMenu>
            <DropdownMenuTrigger className="block px-3 py-2 text-base font-medium rounded-md transition-colors">
              Categories
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link to="/shop?category=Car%20Parts">Body Equipment</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/shop?category=Garage%20Tools">Diagnostics Tools</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/shop?category=Oils%20and%20Fluids">Garage Tools</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/shop?category=Tyres">Diagnostic Scanner</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/shop?category=Accessories">Lube Bay</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/shop?category=Accessories">Our Brand</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActiveLink(item.href)
                      ? "text-primary "
                      : "text-black hover:text-primary "
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile User Account */}
              <Link
                to="/account"
                className="block px-3 py-2 text-base font-medium text-black hover:text-primary "
                onClick={() => setIsMenuOpen(false)}
              >
                My Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


