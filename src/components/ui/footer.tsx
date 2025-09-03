import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Send, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05),transparent_70%)]" />
      
      <div className="relative">
        {/* Top section with newsletter */}
        <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Restez informé</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Ne manquez aucune opportunité
              </h2>
              <p className="text-muted-foreground text-lg">
                Recevez les dernières informations sur les concours, formations et conseils d'orientation directement dans votre boîte mail.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-base"
                  required
                />
                <Button type="submit" size="lg" className="group h-12 px-6">
                  S'abonner
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                En vous abonnant, vous acceptez de recevoir nos communications. Désabonnement possible à tout moment.
              </p>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="bg-background/98 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
              
              {/* Logo et description - 2 colonnes */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/885f13f1-a25a-4445-9468-2fb37844853b.png" 
                      alt="Après Mon Bac" 
                      className="h-14 w-14 rounded-xl shadow-lg"
                    />
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full animate-pulse" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-foreground">
                      Après Mon Bac
                    </span>
                    <p className="text-sm text-muted-foreground">Votre avenir commence ici</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  La plateforme de référence pour l'orientation post-baccalauréat au Bénin. 
                  Nous accompagnons plus de 10,000 étudiants chaque année dans leur choix d'avenir.
                </p>

                {/* Social links avec animations */}
                <div className="flex space-x-3">
                  {[
                    { icon: Facebook, href: "#", label: "Facebook" },
                    { icon: Twitter, href: "#", label: "Twitter" },
                    { icon: Instagram, href: "#", label: "Instagram" }
                  ].map(({ icon: Icon, href, label }) => (
                    <Button 
                      key={label}
                      variant="outline" 
                      size="sm" 
                      className="p-3 hover:scale-105 transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary group"
                      asChild
                    >
                      <a href={href} aria-label={label}>
                        <Icon className="h-4 w-4 group-hover:animate-pulse" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                  Navigation
                  <ArrowRight className="h-4 w-4 text-primary" />
                </h3>
                <ul className="space-y-3">
                  {[
                    { to: "/universities", label: "Universités" },
                    { to: "/filieres", label: "Filières" },
                    { to: "/concours", label: "Concours" },
                    { to: "/stages", label: "Stages" },
                    { to: "/formations", label: "Formations" },
                    { to: "/conseils", label: "Conseils" }
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link 
                        to={to} 
                        className="text-muted-foreground hover:text-primary transition-colors text-sm group flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                  Support
                  <ArrowRight className="h-4 w-4 text-primary" />
                </h3>
                <ul className="space-y-3">
                  {[
                    { to: "/aide", label: "Centre d'aide" },
                    { to: "/contact", label: "Nous contacter" },
                    { to: "/faq", label: "FAQ" },
                    { to: "/conditions", label: "Conditions" },
                    { to: "/confidentialite", label: "Confidentialité" }
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <Link 
                        to={to} 
                        className="text-muted-foreground hover:text-primary transition-colors text-sm group flex items-center gap-2"
                      >
                        <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact avec design amélioré */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                  Contact
                  <ArrowRight className="h-4 w-4 text-primary" />
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Mail, text: "contact@apresmonbac.bj", href: "mailto:contact@apresmonbac.bj" },
                    { icon: Phone, text: "+229 XX XX XX XX", href: "tel:+229xxxxxxxx" },
                    { icon: MapPin, text: "Cotonou, Bénin", href: "#" }
                  ].map(({ icon: Icon, text, href }) => (
                    <a 
                      key={text}
                      href={href}
                      className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span>{text}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm text-center md:text-left">
                © 2024 Après Mon Bac. Tous droits réservés. 
                <span className="hidden sm:inline"> Plateforme d'orientation pour les bacheliers béninois.</span>
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Fait avec</span>
                <span className="text-red-500 animate-pulse">♥</span>
                <span>pour l'éducation au Bénin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;