import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { University } from '@/types/data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MapPin, Users, Calendar, ExternalLink, GraduationCap, BookOpen, Building, Phone, Mail, Globe, ChevronDown, ChevronUp, MapIcon } from 'lucide-react';
import filieresData from '@/data/filieres.json';

interface UniversityCardProps {
  university: University;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  const [expandedSchools, setExpandedSchools] = useState<Record<string, boolean>>({});

  // Obtenir les filières disponibles dans cette université
  const availableFilieres = filieresData.filter(filiere => 
    filiere.universities.includes(university.id)
  );

  const toggleSchool = (schoolId: string) => {
    setExpandedSchools(prev => ({
      ...prev,
      [schoolId]: !prev[schoolId]
    }));
  };

  // Créer un mapping des programmes vers les filières
  const getFiliereLinkForProgram = (programName: string) => {
    const normalizedProgram = programName.toLowerCase();
    const matchingFiliere = filieresData.find(filiere => 
      filiere.name.toLowerCase().includes(normalizedProgram) ||
      normalizedProgram.includes(filiere.name.toLowerCase()) ||
      filiere.slug.includes(normalizedProgram.replace(/\s+/g, '-'))
    );
    return matchingFiliere ? `/filieres/${matchingFiliere.slug}` : null;
  };

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
            className={`${university.type === 'Public' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-white'} font-medium`}
          >
            {university.type === 'Public' ? 'Publique' : 'Privée'}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-xl text-white mb-1">
            {university.name}
          </h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {university.location}
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
            <p className="font-semibold text-sm">{university.studentCount || 'Non spécifié'}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <Calendar className="h-4 w-4 mr-1" />
            </div>
            <p className="text-xs text-muted-foreground">Fondée en</p>
            <p className="font-semibold text-sm">{university.established || 'Non spécifié'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground flex items-center">
              <Building className="h-4 w-4 mr-2 text-primary" />
              Écoles & Formations ({university.schools.length})
            </p>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {university.schools.map((school) => (
              <Collapsible key={school.id}>
                <div className="border rounded-lg p-3 bg-muted/30">
                  <CollapsibleTrigger
                    className="w-full text-left"
                    onClick={() => toggleSchool(school.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground mb-1">{school.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{school.description}</p>
                      </div>
                      {expandedSchools[school.id] ? 
                        <ChevronUp className="h-4 w-4 text-primary flex-shrink-0 ml-2" /> : 
                        <ChevronDown className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                      }
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-3 space-y-3">
                    {/* Informations détaillées */}
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex items-center text-muted-foreground">
                        <MapIcon className="h-3 w-3 mr-1" />
                        <span>{school.location}, {school.country}</span>
                      </div>
                      
                      {school.contact.email && (
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          <a href={`mailto:${school.contact.email}`} className="hover:text-primary transition-colors">
                            {school.contact.email}
                          </a>
                        </div>
                      )}
                      
                      {school.contact.phone && (
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          <a href={`tel:${school.contact.phone}`} className="hover:text-primary transition-colors">
                            {school.contact.phone}
                          </a>
                        </div>
                      )}
                      
                      {school.contact.website && (
                        <div className="flex items-center text-muted-foreground">
                          <Globe className="h-3 w-3 mr-1" />
                          <a href={school.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                            Site web
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Conditions d'admission */}
                    {school.admissionRequirements && school.admissionRequirements.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Admission:</p>
                        <div className="flex flex-wrap gap-1">
                          {school.admissionRequirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Programmes/Filières */}
                    {school.programs && school.programs.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-foreground mb-2">Programmes disponibles:</p>
                        <div className="flex flex-wrap gap-1">
                          {school.programs.map((program, index) => {
                            const filiereLink = getFiliereLinkForProgram(program);
                            if (filiereLink) {
                              return (
                                <Link key={index} to={filiereLink}>
                                  <Badge 
                                    variant="default" 
                                    className="text-xs bg-primary hover:bg-primary/80 text-white cursor-pointer transition-colors"
                                  >
                                    {program}
                                  </Badge>
                                </Link>
                              );
                            }
                            return (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {program}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Bon à savoir */}
                    {school.goodToKnow && (
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-xs font-medium text-foreground mb-1">Bon à savoir:</p>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {school.goodToKnow}
                        </p>
                      </div>
                    )}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground flex items-center">
              <GraduationCap className="h-4 w-4 mr-2 text-primary" />
              Filières principales ({availableFilieres.length})
            </p>
          </div>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
            {availableFilieres.slice(0, 6).map((filiere) => (
              <Link key={filiere.id} to={`/filieres/${filiere.slug}`}>
                <Badge 
                  variant="outline" 
                  className="text-xs hover:bg-secondary hover:text-white transition-colors cursor-pointer border-secondary/50"
                >
                  {filiere.name}
                </Badge>
              </Link>
            ))}
            {availableFilieres.length > 6 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{availableFilieres.length - 6} autres
              </Badge>
            )}
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
        {university.website && university.website !== '#' && (
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