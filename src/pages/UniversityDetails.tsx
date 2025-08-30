import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { University } from '@/types/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Phone, Mail, Globe, GraduationCap, Users, BookOpen } from 'lucide-react';
import universitiesData from '@/data/universities.json';
import filieresData from '@/data/filieres-details.json';
import { getSchoolsOfferingFiliere } from '@/utils/filiereGenerator';

const UniversityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const university = universitiesData.find(uni => uni.id === id) as University | undefined;
  
  // Générer toutes les filières
  const allFilieres = useMemo(() => filieresData, []);

  if (!university) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Université non trouvée</h1>
          <Link to="/universities">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux universités
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fonction pour normaliser les noms et créer des correspondances
  function normalizeString(str: string): string {
    return str
      .toLowerCase()
      .replace(/[àáâãäåæ]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõöø]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Fonction pour vérifier si deux noms correspondent
  function namesMatch(filiereName: string, programName: string): boolean {
    const normalizedFiliere = normalizeString(filiereName);
    const normalizedProgram = normalizeString(programName);
    
    // Correspondance exacte
    if (normalizedFiliere === normalizedProgram) {
      return true;
    }
    
    // Correspondances spéciales pour les filières
    const specialMatches: { [key: string]: string[] } = {
      'medecine generale': ['medecine generale', 'medecine humaine', 'medecine'],
      'genie civil': ['genie civil'],
      'informatique': ['informatique', 'genie informatique et telecom', 'mathematiques et informatique'],
      'genie electrique': ['genie electrique', 'genie electrotechnique'],
      'economie': ['economie', 'sciences economiques'],
      'droit': ['droit', 'droit prive', 'droit public'],
      'agriculture': ['agriculture', 'agronomie'],
      'gestion': ['gestion', 'sciences de gestion'],
      'aquaculture': ['aquaculture'],
      'horticulture et amenagement des espaces verts': ['horticulture et amenagement des espaces verts'],
      'gestion et production vegetale et semenciere': ['gestion et production vegetale et semenciere'],
      'industrie des produits agro-alimentaires et nutrition humaine': ['industrie des produits agro-alimentaires et nutrition humaine'],
      'industrie des bio-ressources': ['industrie des bio-ressources'],
      'genie de conditionnement emballage et stockage des produits alimentaires': ['genie de conditionnement emballage et stockage des produits alimentaires'],
      'agroequipement': ['agroequipement', 'machinisme agricole'],
      'electrification rurale et energies renouvelables': ['electrification rurale et energies renouvelables'],
      'infrastructures rurales et assainissement': ['infrastructures rurales et assainissement'],
      'productions et sante animales': ['productions et sante animales', 'production et sante animale'],
      'finance agricole': ['finance agricole'],
      'gestion des exploitations agricoles et entreprises agroalimentaires': ['gestion des exploitations agricoles et entreprises agroalimentaires'],
      'marketing des intrants et produits agricoles': ['marketing des intrants et produits agricoles'],
      'sociologie rurale et vulgarisation agricole': ['sociologie rurale et vulgarisation agricole'],
      'foresterie tropicale': ['foresterie tropicale'],
      'mathematiques': ['mathematiques', 'mathematiques et informatique'],
      'physique': ['physique', 'physique-chimie'],
      'chimie': ['chimie', 'physique-chimie', 'genie chimique procedes'],
      'biologie': ['biologie', 'sciences de la vie'],
      'philosophie': ['philosophie'],
      'histoire': ['histoire'],
      'geographie': ['geographie', 'geographie et amenagement du territoire'],
      'anglais': ['anglais'],
      'francais': ['francais', 'lettres modernes'],
      'psychologie': ['psychologie'],
      'sociologie': ['sociologie', 'socio-anthropologie']
    };
    
    // Vérifier les correspondances spéciales
    const specialKey = specialMatches[normalizedFiliere];
    if (specialKey && specialKey.some(match => normalizedProgram.includes(match))) {
      return true;
    }
    
    // Correspondance partielle (si le nom de la filière est contenu dans le programme)
    if (normalizedProgram.includes(normalizedFiliere) || normalizedFiliere.includes(normalizedProgram)) {
      return true;
    }
    
    return false;
  }

  // Créer un mapping des programmes vers les filières
  const getFiliereLinkForProgram = (programName: string) => {
    const matchingFiliere = allFilieres.find(filiere => namesMatch(filiere.name, programName));
    return matchingFiliere ? `/filieres/${matchingFiliere.slug}` : null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec image et infos de base */}
      <section className="relative h-64 bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0">
          <img
            src={university.image}
            alt={university.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
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
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/universities">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux universités
            </Button>
          </Link>
        </div>

        {/* Description de l'université */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>À propos de {university.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {university.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des écoles */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Écoles et Formations</h2>
            <Badge variant="outline" className="text-sm">
              {university.schools.length} école{university.schools.length > 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid gap-6">
            {university.schools.map((school) => (
              <Card key={school.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{school.name}</CardTitle>
                  <p className="text-muted-foreground">{school.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Informations de contact et localisation */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-foreground">Informations pratiques</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{school.location}, {school.country}</span>
                        </div>
                        
                        {school.contact.phone && (
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            <a href={`tel:${school.contact.phone}`} className="hover:text-primary transition-colors">
                              {school.contact.phone}
                            </a>
                          </div>
                        )}
                        
                        {school.contact.email && (
                          <div className="flex items-center text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2" />
                            <a href={`mailto:${school.contact.email}`} className="hover:text-primary transition-colors">
                              {school.contact.email}
                            </a>
                          </div>
                        )}
                        
                        {school.contact.website && (
                          <div className="flex items-center text-muted-foreground">
                            <Globe className="h-4 w-4 mr-2" />
                            <a href={school.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                              Site web de l'école
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-foreground">Conditions d'admission</h4>
                      <div className="flex flex-wrap gap-2">
                        {school.admissionRequirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Programmes disponibles */}
                  {school.programs && school.programs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-foreground flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Programmes disponibles ({school.programs.length})
                      </h4>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {school.programs.map((program, index) => {
                          const filiereLink = getFiliereLinkForProgram(program);
                          if (filiereLink) {
                            return (
                              <Link key={index} to={filiereLink}>
                                <Badge 
                                  variant="default" 
                                  className="w-full justify-center bg-primary hover:bg-primary/80 text-white cursor-pointer transition-colors p-2 h-auto"
                                >
                                  <span className="text-center text-xs leading-tight">{program}</span>
                                </Badge>
                              </Link>
                            );
                          }
                          return (
                            <Badge key={index} variant="secondary" className="w-full justify-center p-2 h-auto">
                              <span className="text-center text-xs leading-tight">{program}</span>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bon à savoir */}
                  {school.goodToKnow && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold text-sm text-foreground mb-2">Bon à savoir</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {school.goodToKnow}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions globales */}
        <div className="mt-12 text-center">
          <div className="space-y-4">
            {university.website && university.website !== '#' && (
              <Button asChild className="mr-4">
                <a href={university.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Site officiel de l'université
                </a>
              </Button>
            )}
            <Link to="/filieres">
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Découvrir toutes les filières
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetails;