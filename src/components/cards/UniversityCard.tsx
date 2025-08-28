import React from 'react';
import { Link } from 'react-router-dom';
import { University } from '@/types/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar, ExternalLink } from 'lucide-react';

interface UniversityCardProps {
  university: University;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  return (
    <Card className="group hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0 overflow-hidden">
      <div className="relative">
        <img
          src={university.image}
          alt={university.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-4 right-4">
          <Badge 
            variant={university.type === 'publique' ? 'default' : 'secondary'}
            className="bg-background/90 backdrop-blur-sm"
          >
            {university.type === 'publique' ? 'Publique' : 'Privée'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
            {university.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
            {university.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            {university.city}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2 text-primary" />
            {university.studentCount} étudiants
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            Fondée en {university.established}
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm font-medium text-foreground mb-2">
            {university.schools.length} école{university.schools.length > 1 ? 's' : ''} disponible{university.schools.length > 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap gap-1">
            {university.schools.slice(0, 2).map((school) => (
              <Badge key={school.id} variant="outline" className="text-xs">
                {school.name.split(' ')[0]}
              </Badge>
            ))}
            {university.schools.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{university.schools.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button asChild className="flex-1" variant="default">
          <Link to={`/universities/${university.id}`}>
            Voir détails
          </Link>
        </Button>
        {university.website !== '#' && (
          <Button variant="outline" size="sm" asChild>
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