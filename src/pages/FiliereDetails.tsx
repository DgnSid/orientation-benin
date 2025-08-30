import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp, GraduationCap, ArrowLeft, Users, Target, CheckCircle } from 'lucide-react';
import filieresData from '@/data/filieres.json';
import universitiesData from '@/data/universities.json';
import { Filiere, University } from '@/types/data';

const FiliereDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const filiere = filieresData.find(f => f.slug === slug) as Filiere | undefined;
  
  // Get universities offering this filiere
  const universities = universitiesData.filter(uni => 
    filiere?.universities.includes(uni.id)
  ) as University[];

  if (!filiere) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Filière non trouvée</h1>
          <Button asChild>
            <Link to="/filieres">Retour aux filières</Link>
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
            <Link to="/filieres" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux filières
            </Link>
          </Button>
        </div>

        {/* Filiere Header */}
        <div className="bg-card rounded-xl shadow-elegant-lg overflow-hidden mb-8 border">
          <div className="relative h-64 md:h-80">
            <img
              src={filiere.image}
              alt={filiere.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <Badge className="bg-background/90 text-foreground mb-2">
                {filiere.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{filiere.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Durée: {filiere.duration}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {filiere.averageSalary}
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  {filiere.universities.length} université{filiere.universities.length > 1 ? 's' : ''}
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
                <CardTitle>Description de la filière</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {filiere.description}
                </p>
              </CardContent>
            </Card>

            {/* Career Opportunities */}
            <Card className="shadow-elegant-md border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Débouchés professionnels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filiere.careerOpportunities.map((career, index) => (
                    <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">{career}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card className="shadow-elegant-md border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Compétences requises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {filiere.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Universities */}
            <Card className="shadow-elegant-md border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Universités proposant cette filière ({universities.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {universities.map((university) => (
                    <div key={university.id} className="border rounded-lg p-4 hover:shadow-elegant-sm transition-shadow">
                      <div className="flex justify-between items-start">
                      <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{university.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{university.location}</p>
                          <Badge variant={university.type === 'Public' ? 'default' : 'secondary'} className="text-xs">
                            {university.type === 'Public' ? 'Publique' : 'Privée'}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/universities/${university.id}`}>
                            Voir détails
                          </Link>
                        </Button>
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
                <CardTitle>Informations clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                  <p className="font-semibold">{filiere.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Durée d'études</p>
                  <p className="font-semibold">{filiere.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Salaire moyen</p>
                  <p className="font-semibold text-primary">{filiere.averageSalary}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Universités disponibles</p>
                  <p className="font-semibold">{filiere.universities.length} établissement{filiere.universities.length > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Débouchés</p>
                  <p className="font-semibold">{filiere.careerOpportunities.length} métier{filiere.careerOpportunities.length > 1 ? 's' : ''} possible{filiere.careerOpportunities.length > 1 ? 's' : ''}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-elegant-md border">
              <CardContent className="p-6 space-y-3">
                <Button asChild className="w-full">
                  <Link to="/concours">
                    Voir les concours
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/formations">
                    Formations préparatoires
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/conseils">
                    Conseils d'orientation
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

export default FiliereDetails;