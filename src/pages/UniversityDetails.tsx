import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Calendar, ExternalLink, ArrowLeft, GraduationCap } from 'lucide-react';
import universitiesData from '@/data/universities.json';
import { University } from '@/types/data';

const UniversityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const university = universitiesData.find(uni => uni.id === id) as University | undefined;

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Université non trouvée</h1>
          <Button asChild>
            <Link to="/universities">Retour aux universités</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/universities" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux universités
            </Link>
          </Button>
        </div>

        {/* University Header */}
        <div className="bg-card rounded-xl shadow-elegant-lg overflow-hidden mb-8 border">
          <div className="relative h-64 md:h-80">
            <img
              src={university.image}
              alt={university.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant={university.type === 'Public' ? 'default' : 'secondary'}
                  className="bg-background/90 text-foreground"
                >
                  {university.type === 'Public' ? 'Publique' : 'Privée'}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{university.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {university.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {university.studentCount || 'Non spécifié'} étudiants
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Fondée en {university.established || 'Non spécifié'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="shadow-elegant-md border">
              <CardHeader>
                <CardTitle>À propos de l'université</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {university.description}
                </p>
              </CardContent>
            </Card>

            {/* Schools */}
            <Card className="shadow-elegant-md border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Écoles et Facultés ({university.schools.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {university.schools.map((school) => (
                    <div key={school.id} className="border rounded-lg p-4 hover:shadow-elegant-sm transition-shadow">
                      <h3 className="font-semibold text-lg mb-2">{school.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{school.description}</p>
                      <div>
                        <p className="text-sm font-medium mb-2">Programmes disponibles:</p>
                        <div className="flex flex-wrap gap-1">
                          {school.programs.map((program, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {program}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="shadow-elegant-md border">
              <CardHeader>
                <CardTitle>Informations pratiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="font-semibold">{university.type === 'Public' ? 'Université publique' : 'Université privée'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Localisation</p>
                  <p className="font-semibold">{university.location}, Bénin</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Année de création</p>
                  <p className="font-semibold">{university.established}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre d'étudiants</p>
                  <p className="font-semibold">{university.studentCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Écoles/Facultés</p>
                  <p className="font-semibold">{university.schools.length} département{university.schools.length > 1 ? 's' : ''}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-elegant-md border">
              <CardContent className="p-6 space-y-3">
                {university.website !== '#' && (
                  <Button asChild className="w-full">
                    <a href={university.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Site officiel
                    </a>
                  </Button>
                )}
                <Button variant="outline" asChild className="w-full">
                  <Link to="/filieres">
                    Voir les filières disponibles
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetails;