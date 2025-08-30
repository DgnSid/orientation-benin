import React, { useState, useMemo } from 'react';
import { Search, Award, Clock, Users, Star, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import formationsData from '@/data/formations.json';
import heroImage from '@/assets/hero-education.jpg';

interface Formation {
  id: string;
  title: string;
  instructor: string;
  price: number;
  duration: string;
  level: string;
  description: string;
  objectives: string[];
  content: string[];
  image: string;
  category: string;
  startDate: string;
}

const Formations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const categories = useMemo(() => {
    const allCategories = formationsData.map((formation: Formation) => formation.category);
    return ['Toutes', ...Array.from(new Set(allCategories))];
  }, []);

  const levels = useMemo(() => {
    const allLevels = formationsData.map((formation: Formation) => formation.level);
    return ['Tous niveaux', ...Array.from(new Set(allLevels))];
  }, []);

  const filteredFormations = useMemo(() => {
    return formationsData.filter((formation: Formation) => {
      const matchesSearch = formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formation.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formation.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || selectedCategory === 'Toutes' || formation.category === selectedCategory;
      const matchesLevel = selectedLevel === '' || selectedLevel === 'Tous niveaux' || formation.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchTerm, selectedCategory, selectedLevel]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Intermédiaire':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'Avancé':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Formations professionnelles" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Award className="h-16 w-16 mx-auto mb-6 animate-bounce-in" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Formations Professionnelles
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Développez vos compétences avec nos formations de qualité
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
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="transition-all duration-300"
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {levels.map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                    className="transition-all duration-300"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formations Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFormations.map((formation: Formation, index) => (
              <Card 
                key={formation.id} 
                className="group hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge 
                      variant="secondary" 
                      className="bg-secondary/10 text-secondary border-secondary/20"
                    >
                      {formation.category}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={getLevelColor(formation.level)}
                    >
                      {formation.level}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                      {formation.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Par {formation.instructor}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {formation.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{formation.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-secondary" />
                      <span>Début : {formatDate(formation.startDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 text-accent" />
                      <span>Places limitées</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Objectifs principaux :
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {formation.objectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="h-3 w-3 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                      {formation.objectives.length > 2 && (
                        <li className="text-primary text-xs">
                          +{formation.objectives.length - 2} autres objectifs
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(formation.price)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Prix tout compris
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 flex gap-2">
                  <Button className="flex-1 group-hover:bg-primary-dark transition-colors duration-300">
                    S'inscrire
                  </Button>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredFormations.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucune formation trouvée
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

export default Formations;