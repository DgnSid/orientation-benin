import React, { useState, useMemo } from 'react';
import { Search, Calendar, MapPin, Clock, ExternalLink, Target } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import concoursData from '@/data/concours.json';

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
                          concours.institution.toLowerCase().includes(searchTerm.toLowerCase());
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

  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge 
                      variant="secondary" 
                      className="bg-secondary/10 text-secondary border-secondary/20"
                    >
                      {concours.domain}
                    </Badge>
                    {isDeadlineSoon(concours.deadline) && (
                      <Badge variant="destructive" className="animate-pulse">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                      {concours.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {concours.institution}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {concours.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-destructive" />
                      <span>Limite : {formatDate(concours.deadline)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-secondary" />
                      <span>Examen : {formatDate(concours.examDate)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Prérequis principaux :
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {concours.requirements.slice(0, 2).map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                      {concours.requirements.length > 2 && (
                        <li className="text-primary text-xs">
                          +{concours.requirements.length - 2} autres conditions
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button className="w-full group-hover:bg-primary-dark transition-colors duration-300">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Plus d'infos
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