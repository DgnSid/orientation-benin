import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap, Home, Building2, BookOpen, Target, Briefcase, Award, Lightbulb } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Universités', path: '/universities', icon: Building2 },
    { name: 'Filières', path: '/filieres', icon: BookOpen },
    { name: 'Concours', path: '/concours', icon: Target },
    { name: 'Stages', path: '/stages', icon: Briefcase },
    { name: 'Formations', path: '/formations', icon: Award },
    { name: 'Conseils', path: '/conseils', icon: Lightbulb },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav ref={menuRef} className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-elegant-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/lovable-uploads/885f13f1-a25a-4445-9468-2fb37844853b.png" 
              alt="Après Mon Bac" 
              className="h-10 w-10 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Après Mon Bac
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-elegant-sm relative overflow-hidden group",
                  isActivePath(item.path)
                    ? "bg-gradient-primary text-primary-foreground shadow-elegant-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {/* Orange hover effect */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-transform duration-300 ease-out",
                  isActivePath(item.path) 
                    ? "translate-x-0" 
                    : "-translate-x-full group-hover:translate-x-0"
                )} />
                <div className="relative z-10 flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 relative z-50"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={cn(
                  "absolute inset-0 transition-transform duration-300",
                  isMenuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                )}>
                  <Menu className="h-6 w-6" />
                </span>
                <span className={cn(
                  "absolute inset-0 transition-transform duration-300",
                  isMenuOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"
                )}>
                  <X className="h-6 w-6" />
                </span>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isMenuOpen 
            ? "max-h-screen opacity-100 pb-6" 
            : "max-h-0 opacity-0 pb-0"
        )}>
          <div className="pt-4 space-y-1 bg-card/50 backdrop-blur-sm rounded-lg mt-2 border border-border/50">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                  "animate-slide-up",
                  isActivePath(item.path)
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-elegant-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Orange hover effect for mobile */}
                {!isActivePath(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0" />
                )}
                <div className="relative z-10 flex items-center w-full">
                  <item.icon className="mr-3 h-5 w-5" />
                  <span className="flex-1">{item.name}</span>
                  {isActivePath(item.path) && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;