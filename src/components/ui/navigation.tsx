import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap, Home, Building2, BookOpen, Target, Briefcase, Award, Lightbulb } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-elegant-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-2 rounded-lg group-hover:shadow-elegant-md transition-all duration-300">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Après Mon Bac
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-elegant-sm",
                  isActivePath(item.path)
                    ? "bg-gradient-primary text-primary-foreground shadow-elegant-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 bg-card border-t border-border animate-in slide-in-from-top duration-300">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                  isActivePath(item.path)
                    ? "bg-gradient-primary text-primary-foreground shadow-elegant-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;