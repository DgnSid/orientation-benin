import React from 'react';
import { Link } from 'react-router-dom';
import { University } from '@/types/data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar, ExternalLink, GraduationCap, BookOpen, Building } from 'lucide-react';
import filieresData from '@/data/filieres.json';

interface UniversityCardProps {
  university: University;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  // Obtenir les filières disponibles dans cette université
  const availableFilieres = filieresData.filter(filiere => 
    filiere.universities.includes(university.id)
  );

  return (
    <Card className="group hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-primary/20 overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img
          src={university.image}
          alt={university.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge 
            className={`${university.type === 'publique' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-white'} font-medium`}
          >
            {university.type === 'publique' ? 'Publique' : 'Privée'}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-xl text-white mb-1">
            {university.name}
          </h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {university.city}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4 flex-1">
        <div>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {university.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 bg-muted/30 rounded-lg px-3">
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <Users className="h-4 w-4 mr-1" />
            </div>
            <p className="text-xs text-muted-foreground">Étudiants</p>
            <p className="font-semibold text-sm">{university.studentCount}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <Calendar className="h-4 w-4 mr-1" />
            </div>
            <p className="text-xs text-muted-foreground">Fondée en</p>
            <p className="font-semibold text-sm">{university.established}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground flex items-center">
              <Building className="h-4 w-4 mr-2 text-primary" />
              Écoles ({university.schools.length})
            </p>
          </div>
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {university.schools.map((school) => (
              <div key={school.id} className="text-xs bg-muted/50 rounded p-2">
                <p className="font-medium text-foreground">{school.name}</p>
                <p className="text-muted-foreground line-clamp-1">{school.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground flex items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-primary" />
              Filières disponibles ({availableFilieres.length})
            </p>
          </div>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
            {availableFilieres.map((filiere) => (
              <Link key={filiere.id} to={`/filieres/${filiere.slug}`}>
                <Badge 
                  variant="outline" 
                  className="text-xs hover:bg-primary hover:text-white transition-colors cursor-pointer border-primary/50"
                >
                  {filiere.name}
                </Badge>
              </Link>
            ))}
            {availableFilieres.length === 0 && (
              <span className="text-xs text-muted-foreground italic">Aucune filière répertoriée</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button asChild className="flex-1 bg-primary hover:bg-primary-dark text-white" variant="default">
          <Link to={`/universities/${university.id}`}>
            <BookOpen className="h-4 w-4 mr-2" />
            Voir détails
          </Link>
        </Button>
        {university.website !== '#' && (
          <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary hover:text-white">
            <a href={university.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UniversityCard;