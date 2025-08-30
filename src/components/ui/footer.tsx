import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-primary border-t-4 border-secondary mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo-apres-mon-bac.png" 
                alt="Après Mon Bac" 
                className="h-12 w-12"
              />
              <span className="text-xl font-bold text-white">
                Après Mon Bac
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Votre guide complet pour l'orientation post-baccalauréat au Bénin. 
              Trouvez votre voie parmi les universités, filières et opportunités disponibles.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-secondary hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-secondary hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-secondary hover:text-white">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation rapide */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/universities" className="text-white/70 hover:text-secondary transition-colors text-sm">Universités</Link></li>
              <li><Link to="/filieres" className="text-white/70 hover:text-secondary transition-colors text-sm">Filières</Link></li>
              <li><Link to="/concours" className="text-white/70 hover:text-secondary transition-colors text-sm">Concours</Link></li>
              <li><Link to="/stages" className="text-white/70 hover:text-secondary transition-colors text-sm">Stages</Link></li>
              <li><Link to="/formations" className="text-white/70 hover:text-secondary transition-colors text-sm">Formations</Link></li>
              <li><Link to="/conseils" className="text-white/70 hover:text-secondary transition-colors text-sm">Conseils</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/aide" className="text-white/70 hover:text-secondary transition-colors text-sm">Centre d'aide</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-secondary transition-colors text-sm">Nous contacter</Link></li>
              <li><Link to="/faq" className="text-white/70 hover:text-secondary transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/conditions" className="text-white/70 hover:text-secondary transition-colors text-sm">Conditions d'utilisation</Link></li>
              <li><Link to="/confidentialite" className="text-white/70 hover:text-secondary transition-colors text-sm">Confidentialité</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <Mail className="h-4 w-4 text-secondary" />
                <span>contact@apresmonbac.bj</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <Phone className="h-4 w-4 text-secondary" />
                <span>+229 XX XX XX XX</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>Cotonou, Bénin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/70 text-sm">
            © 2024 Après Mon Bac. Tous droits réservés. Plateforme d'orientation pour les bacheliers béninois.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;