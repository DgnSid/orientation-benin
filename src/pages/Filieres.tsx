import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import FiliereCard from '@/components/cards/FiliereCard';
import { generateAllFilieres } from '@/utils/filiereGenerator';
import { Filiere } from '@/types/data';

const Filieres = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Get all unique filieres from the universities data
  const allFilieres = useMemo(() => generateAllFilieres(), []);

  // Filter filieres by search term only
  const filteredFilieres = useMemo(() => {
    return allFilieres.filter(filiere => {
      const matchesSearch = searchTerm === '' || 
        filiere.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filiere.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filiere.careerOpportunities.some(career => 
          career.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      return matchesSearch;
    });
  }, [allFilieres, searchTerm]);

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

        {/* Search Filter */}
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
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredFilieres.length} filière{filteredFilieres.length !== 1 ? 's' : ''} trouvée{filteredFilieres.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid des filières */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFilieres.map((filiere) => (
            <FiliereCard key={filiere.id} filiere={filiere} />
          ))}
        </div>

        {/* Message si aucune filière trouvée */}
        {filteredFilieres.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune filière trouvée</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier votre recherche pour obtenir plus de résultats.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Réinitialiser la recherche
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filieres;