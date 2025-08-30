import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import FiliereCard from '@/components/cards/FiliereCard';
import filieresData from '@/data/filieres-details.json';
import { getSchoolsOfferingFiliere, getUniversitiesOfferingFiliere } from '@/utils/filiereGenerator';
import { Filiere } from '@/types/data';

const Filieres = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get all unique filieres from the static data
  const allFilieres = useMemo(() => {
    return filieresData.map(filiere => ({
      ...filiere,
      universities: getUniversitiesOfferingFiliere(filiere.name)
    }));
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const categorySet = new Set(allFilieres.map(filiere => filiere.category));
    return Array.from(categorySet).sort();
  }, [allFilieres]);

  // Filter filieres
  const filteredFilieres = useMemo(() => {
    return allFilieres.filter(filiere => {
      const matchesSearch = filiere.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          filiere.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || filiere.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [allFilieres, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            Filières d'Études
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explorez les différentes filières d'études disponibles au Bénin. 
            Découvrez les débouchés, les compétences requises et choisissez votre voie.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl shadow-elegant-md p-6 mb-8 border">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une filière..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm min-w-48"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Active filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredFilieres.length} filière{filteredFilieres.length !== 1 ? 's' : ''} trouvée{filteredFilieres.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Categories overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="text-center h-auto py-3 px-2"
              size="sm"
            >
              <div className="text-xs font-medium">
                {category}
                <div className="text-xs opacity-70 mt-1">
                  {allFilieres.filter(f => f.category === category).length} filière{allFilieres.filter(f => f.category === category).length > 1 ? 's' : ''}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Filieres Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFilieres.map((filiere) => (
            <FiliereCard key={filiere.id} filiere={filiere} />
          ))}
        </div>

        {/* No results */}
        {filteredFilieres.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune filière trouvée</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche pour obtenir plus de résultats.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              variant="outline"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filieres;