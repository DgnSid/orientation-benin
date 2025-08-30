import React, { useState, useMemo } from 'react';
import { Search, Target, Clock, Building2, Calendar, FileText, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import concoursData from '@/data/concours.json';
import heroImage from '@/assets/hero-education.jpg';

interface Concours {
  id: string;
  title: string;
  institution: string;
  deadline: string;
  examDate: string;
  description: string;
  requirements: string[];
  documentsNeeded: string[];
  applicationLink: string;
  domain: string;
}

const Concours = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  const domains = useMemo(() => {
    const allDomains = concoursData.map((concours: Concours) => concours.domain);
    return ['Tous', ...Array.from(new Set(allDomains))];
  }, []);

  const filteredConcours = useMemo(() => {
    return concoursData.filter((concours: Concours) => {
      const matchesSearch = concours.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          concours.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          concours.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === '' || selectedDomain === 'Tous' || concours.domain === selectedDomain;
      
      return matchesSearch && matchesDomain;
    });
  }, [searchTerm, selectedDomain]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Grandes Écoles': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'Médecine': 'bg-green-500/10 text-green-600 border-green-500/20',
      'Ingénierie': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      'Commerce': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'Fonction Publique': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  const isDeadlineClose = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Concours et examens" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Target className="h-16 w-16 mx-auto mb-6 animate-bounce-in" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Concours et Examens
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Découvrez tous les concours d'entrée aux grandes écoles et universités du Bénin
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un concours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <Button
                  key={domain}
                  variant={selectedDomain === domain ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDomain(domain)}
                  className="transition-all duration-300"
                >
                  {domain}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Concours Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredConcours.map((concours: Concours, index) => (
              <Card 
                key={concours.id} 
                className="group hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-secondary">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Target className="h-16 w-16 text-white/80" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="outline"
                      className={`bg-white/90 backdrop-blur-sm ${getCategoryColor(concours.domain)}`}
                    >
                      {concours.domain}
                    </Badge>
                  </div>
                  {isDeadlineClose(concours.deadline) && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive" className="animate-pulse">
                        Urgente
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-3">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {concours.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>{concours.institution}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {concours.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>Limite : {formatDate(concours.deadline)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-secondary" />
                      <span>Examen : {formatDate(concours.examDate)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Documents requis :
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {concours.documentsNeeded.slice(0, 3).map((doc, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-muted/50"
                        >
                          <FileText className="h-2 w-2 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                      {concours.documentsNeeded.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-muted/50">
                          +{concours.documentsNeeded.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button 
                    className="w-full group-hover:bg-primary-dark transition-colors duration-300"
                    asChild
                  >
                    <a href={concours.applicationLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Plus d'infos
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredConcours.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucun concours trouvé
              </h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Concours;