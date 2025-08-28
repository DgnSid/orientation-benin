import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Après Mon Bac
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Votre guide complet pour l'orientation post-baccalauréat au Bénin. 
              Trouvez votre voie parmi les universités, filières et opportunités disponibles.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation rapide */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/universities" className="text-muted-foreground hover:text-primary transition-colors text-sm">Universités</Link></li>
              <li><Link to="/filieres" className="text-muted-foreground hover:text-primary transition-colors text-sm">Filières</Link></li>
              <li><Link to="/concours" className="text-muted-foreground hover:text-primary transition-colors text-sm">Concours</Link></li>
              <li><Link to="/stages" className="text-muted-foreground hover:text-primary transition-colors text-sm">Stages</Link></li>
              <li><Link to="/formations" className="text-muted-foreground hover:text-primary transition-colors text-sm">Formations</Link></li>
              <li><Link to="/conseils" className="text-muted-foreground hover:text-primary transition-colors text-sm">Conseils</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/aide" className="text-muted-foreground hover:text-primary transition-colors text-sm">Centre d'aide</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Nous contacter</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/conditions" className="text-muted-foreground hover:text-primary transition-colors text-sm">Conditions d'utilisation</Link></li>
              <li><Link to="/confidentialite" className="text-muted-foreground hover:text-primary transition-colors text-sm">Confidentialité</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@apresmonbac.bj</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+229 XX XX XX XX</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Cotonou, Bénin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Après Mon Bac. Tous droits réservés. Plateforme d'orientation pour les bacheliers béninois.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;