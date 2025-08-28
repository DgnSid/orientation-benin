import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import UniversityCard from '@/components/cards/UniversityCard';
import universitiesData from '@/data/universities.json';
import { University } from '@/types/data';

const Universities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'publique' | 'privee'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const universities = universitiesData as University[];

  // Get unique cities
  const cities = useMemo(() => {
    const citySet = new Set(universities.map(uni => uni.city));
    return Array.from(citySet).sort();
  }, [universities]);

  // Filter universities
  const filteredUniversities = useMemo(() => {
    return universities.filter(university => {
      const matchesSearch = university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          university.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || university.type === selectedType;
      const matchesCity = selectedCity === 'all' || university.city === selectedCity;
      
      return matchesSearch && matchesType && matchesCity;
    });
  }, [universities, searchTerm, selectedType, selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            Universités du Bénin
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les meilleures institutions d'enseignement supérieur du Bénin. 
            Explorez leurs programmes, leurs spécialités et trouvez celle qui correspond à vos ambitions.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl shadow-elegant-md p-6 mb-8 border">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une université..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                size="sm"
              >
                Toutes
              </Button>
              <Button
                variant={selectedType === 'publique' ? 'default' : 'outline'}
                onClick={() => setSelectedType('publique')}
                size="sm"
              >
                Publiques
              </Button>
              <Button
                variant={selectedType === 'privee' ? 'default' : 'outline'}
                onClick={() => setSelectedType('privee')}
                size="sm"
              >
                Privées
              </Button>
            </div>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="all">Toutes les villes</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Active filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedType !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedType === 'publique' ? 'Publiques' : 'Privées'}
                <button onClick={() => setSelectedType('all')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {selectedCity !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCity}
                <button onClick={() => setSelectedCity('all')} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
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
            {filteredUniversities.length} université{filteredUniversities.length !== 1 ? 's' : ''} trouvée{filteredUniversities.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUniversities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>

        {/* No results */}
        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune université trouvée</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche pour obtenir plus de résultats.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedCity('all');
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

export default Universities;