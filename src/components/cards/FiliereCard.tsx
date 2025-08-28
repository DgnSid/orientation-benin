import React from 'react';
import { Link } from 'react-router-dom';
import { Filiere } from '@/types/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, GraduationCap } from 'lucide-react';

interface FiliereCardProps {
  filiere: Filiere;
}

const FiliereCard: React.FC<FiliereCardProps> = ({ filiere }) => {
  return (
    <Card className="group hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0 overflow-hidden h-full">
      <div className="relative">
        <img
          src={filiere.image}
          alt={filiere.name}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-background/90 backdrop-blur-sm">
            {filiere.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4 flex-1">
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
            {filiere.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
            {filiere.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Durée: {filiere.duration}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            {filiere.averageSalary}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 mr-2 text-primary" />
            {filiere.universities.length} université{filiere.universities.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm font-medium text-foreground mb-2">Débouchés principaux:</p>
          <div className="flex flex-wrap gap-1">
            {filiere.careerOpportunities.slice(0, 3).map((career, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {career}
              </Badge>
            ))}
            {filiere.careerOpportunities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{filiere.careerOpportunities.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full" variant="default">
          <Link to={`/filieres/${filiere.slug}`}>
            Découvrir la filière
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FiliereCard;