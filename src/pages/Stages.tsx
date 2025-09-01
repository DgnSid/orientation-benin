import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Briefcase, Mail, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import stagesData from '@/data/stages.json';
import heroImage from '@/assets/hero-education.jpg';

interface Stage {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  domain: string;
  description: string;
  requirements: string[];
  applicationDeadline: string;
  contactEmail: string;
  salary: string;
  type: string;
}

const Stages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  const domains = useMemo(() => {
    const allDomains = stagesData.map((stage: Stage) => stage.domain);
    return ['Tous', ...Array.from(new Set(allDomains))];
  }, []);

  const types = useMemo(() => {
    const allTypes = stagesData.map((stage: Stage) => stage.type);
    return ['Tous', ...Array.from(new Set(allTypes))];
  }, []);

  const filteredStages = useMemo(() => {
    return stagesData.filter((stage: Stage) => {
      const matchesSearch = stage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stage.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stage.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === '' || selectedDomain === 'Tous' || stage.domain === selectedDomain;
      const matchesType = selectedType === '' || selectedType === 'Tous' || stage.type === selectedType;
      
      return matchesSearch && matchesDomain && matchesType;
    });
  }, [searchTerm, selectedDomain, selectedType]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Offres de stages" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Briefcase className="h-16 w-16 mx-auto mb-6 animate-bounce-in" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Offres de Stages
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Trouvez le stage idéal pour développer vos compétences professionnelles
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un stage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-1">
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
              
              <div className="flex flex-wrap gap-1">
                {types.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="transition-all duration-300"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stages Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStages.map((stage: Stage, index) => (
              <Card 
                key={stage.id} 
                className="group hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge 
                      variant="secondary" 
                      className="bg-secondary/10 text-secondary border-secondary/20"
                    >
                      {stage.domain}
                    </Badge>
                    <Badge 
                      variant={stage.type === 'Rémunéré' ? 'default' : 'outline'}
                      className={stage.type === 'Rémunéré' ? 'bg-primary/10 text-primary border-primary/20' : ''}
                    >
                      {stage.type}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stage.company}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {stage.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{stage.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-secondary" />
                      <span>{stage.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-2 text-accent" />
                      <span className="text-xs">{stage.salary}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Prérequis :
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {stage.requirements.slice(0, 2).map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                      {stage.requirements.length > 2 && (
                        <li className="text-primary text-xs">
                          +{stage.requirements.length - 2} autres exigences
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Candidature avant :</span> {formatDate(stage.applicationDeadline)}
                  </div>
                </CardContent>

                <CardFooter className="pt-0 flex gap-2">
                  <Button className="flex-1 group-hover:bg-primary-dark transition-colors duration-300">
                    Postuler
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${stage.contactEmail}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredStages.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucun stage trouvé
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

export default Stages;