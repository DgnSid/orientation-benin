import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, GraduationCap, Briefcase, Trophy, Users, ArrowRight, BookOpen, Target, TrendingUp } from 'lucide-react';

// Animation de texte simple et fiable
const TextAnimation = ({ texts }: { texts: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        setDisplayedText(currentText.substring(0, displayedText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayedText(currentText.substring(0, displayedText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && displayedText === currentText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentIndex, texts, typingSpeed]);

  return (
    <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-foreground min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
      {displayedText}
      <span className="ml-1 inline-block w-1 h-8 bg-primary animate-pulse"></span>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();

  const animatedTexts = [
    "Bonjour,",
    "Tu viens d'obtenir ton bac ?",
    "Alors Bravo et félicitations à toi...",
    "Quelle filière veux-tu vraiment faire ?",
    "Tu veux être accompagné pour faire le meilleur choix ?",
    "Sur ce site, tu trouveras tout ce qu'il te faut...",
    "Clique sur Commencer l'exploration."
  ];

  const stats = [
    { label: 'Universités', value: '10+', icon: GraduationCap },
    { label: 'Filières', value: '50+', icon: BookOpen },
    { label: 'Étudiants aidés', value: '1000+', icon: Users },
    { label: 'Taux de réussite', value: '85%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pb-24 md:pb-32 bg-muted">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-foreground">
                <TextAnimation texts={animatedTexts} />
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
                <span className="text-primary font-semibold">Explorez</span> les universités, filières et opportunités pour construire votre avenir. 
                Guide complet pour les nouveaux bacheliers du Bénin.
              </p>
              
              <div className="space-y-4">
                <Link to="/universities" className="block w-full">
                  <Button 
                    size="lg" 
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 text-base"
                  >
                    Commencer l'exploration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-base text-muted-foreground text-center sm:text-left">
                  Plus de 1000 étudiants nous font déjà confiance
                </p>
              </div>
            </div>
            
            <div className="relative flex justify-center">
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-primary/20">
                <img
                  src="/logo-apres-mon-bac.png"
                  alt="Après mon Bac - Logo officiel"
                  className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain mx-auto"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border-border shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Votre réussite commence ici</h2>
            <p className="text-xl text-muted-foreground">Découvrez toutes les ressources dont vous avez besoin pour votre avenir</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-background rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Universités</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Explorez toutes les universités du Bénin avec leurs filières et conditions d'admission
              </p>
              <Link to="/universities">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Explorer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-background rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Filières & Débouchés</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Découvrez les formations disponibles et leurs perspectives d'emploi
              </p>
              <Link to="/filieres">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Découvrir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-background rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Stages & Opportunités</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Trouvez des stages et développez votre expérience professionnelle
              </p>
              <Link to="/stages">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Voir les stages
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-background rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Concours & Hackathons</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Participez aux concours et challenges pour vous démarquer
              </p>
              <Link to="/concours">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Participer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-background rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Formations Pratiques</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Développez vos compétences avec nos formations spécialisées
              </p>
              <Link to="/formations">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Se former
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-background rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-border">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Conseils</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Guides et conseils d'orientation pour réussir vos études
              </p>
              <Link to="/conseils">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Lire nos conseils
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Test d'Orientation CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight">
                  Trouvez votre voie idéale
                </h2>
                <p className="text-lg text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto">
                  Notre test d'orientation analyse vos centres d'intérêt, compétences et aspirations 
                  pour vous recommander les filières les plus adaptées à votre profil.
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 pt-6">
                <div className="bg-primary-foreground/10 backdrop-blur-md rounded-xl p-6 border border-primary-foreground/20 max-w-md">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-primary-foreground">50+</div>
                      <div className="text-primary-foreground/70 text-xs md:text-sm mt-1">Filières</div>
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-primary-foreground">15</div>
                      <div className="text-primary-foreground/70 text-xs md:text-sm mt-1">Questions</div>
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-primary-foreground">5min</div>
                      <div className="text-primary-foreground/70 text-xs md:text-sm mt-1">Durée</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mt-6 space-x-2 text-primary-foreground/70">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-xs md:text-sm font-medium">100% gratuit • Résultats instantanés</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Commencer le test
                  </Button>
                </div>
              </div>
              
              <div className="pt-8">
                <p className="text-primary-foreground/70 text-sm md:text-base">
                  Rejoignez plus de <span className="font-semibold text-secondary">1,000 étudiants</span> 
                  qui ont trouvé leur voie grâce à notre test
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;