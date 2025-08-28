import React, { useState, useMemo } from 'react';
import { Search, Lightbulb, Clock, User, Tag, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import conseilsData from '@/data/conseils.json';

interface Conseil {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  image: string;
  tags: string[];
  summary: string;
}

const Conseils = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = useMemo(() => {
    const allCategories = conseilsData.map((conseil: Conseil) => conseil.category);
    return ['Toutes', ...Array.from(new Set(allCategories))];
  }, []);

  const filteredConseils = useMemo(() => {
    return conseilsData.filter((conseil: Conseil) => {
      const matchesSearch = conseil.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          conseil.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          conseil.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === '' || selectedCategory === 'Toutes' || conseil.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Orientation': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'Admission': 'bg-green-500/10 text-green-600 border-green-500/20',
      'Financement': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      'Études': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'Vie étudiante': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Lightbulb className="h-16 w-16 mx-auto mb-6 animate-bounce-in" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conseils et Guides
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Des conseils d'experts pour réussir votre orientation et vos études
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
                placeholder="Rechercher un conseil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredConseils.map((conseil: Conseil, index) => (
              <Card 
                key={conseil.id} 
                className="group hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-secondary">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Lightbulb className="h-16 w-16 text-white/80" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="outline"
                      className={`bg-white/90 backdrop-blur-sm ${getCategoryColor(conseil.category)}`}
                    >
                      {conseil.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="space-y-3">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {conseil.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{conseil.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{conseil.readTime}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {conseil.summary}
                  </p>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(conseil.date)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {conseil.tags.slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs bg-muted/50"
                      >
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {conseil.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-muted/50">
                        +{conseil.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button className="w-full group-hover:bg-primary-dark transition-colors duration-300">
                    Lire l'article
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredConseils.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucun conseil trouvé
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

export default Conseils;