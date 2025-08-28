import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, Target, Briefcase, Trophy, Users, ArrowRight, Star } from 'lucide-react';

const Index = () => {
  const stats = [
    { label: 'Universités', value: '10+', icon: GraduationCap },
    { label: 'Filières', value: '50+', icon: BookOpen },
    { label: 'Étudiants aidés', value: '1000+', icon: Users },
    { label: 'Taux de réussite', value: '85%', icon: Star },
  ];

  const sections = [
    {
      title: 'Universités',
      description: 'Découvrez les meilleures universités du Bénin',
      icon: '🏛️',
      path: '/universities',
      color: 'from-primary to-primary-light'
    },
    {
      title: 'Filières',
      description: 'Explorez toutes les filières d\'études disponibles',
      icon: '📚',
      path: '/filieres',
      color: 'from-secondary to-secondary-light'
    },
    {
      title: 'Concours',
      description: 'Informations sur les concours d\'entrée',
      icon: '🎯',
      path: '/concours',
      color: 'from-accent to-accent'
    },
    {
      title: 'Stages',
      description: 'Trouvez des opportunités de stage',
      icon: '💼',
      path: '/stages',
      color: 'from-primary to-secondary'
    },
    {
      title: 'Formations',
      description: 'Formations préparatoires et certifiantes',
      icon: '🎓',
      path: '/formations',
      color: 'from-secondary to-primary'
    },
    {
      title: 'Conseils',
      description: 'Guides et conseils d\'orientation',
      icon: '💡',
      path: '/conseils',
      color: 'from-accent to-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="max-w-7xl mx-auto text-center relative">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Plateforme d'orientation post-bac au Bénin
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Après Mon Bac
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            Votre guide complet pour réussir votre orientation post-baccalauréat au Bénin. 
            Explorez les universités, découvrez les filières et construisez votre avenir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300">
              <Link to="/universities">
                Découvrir les universités
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="text-lg px-8 py-6 hover:shadow-elegant-md transition-all duration-300">
              <Link to="/filieres">
                Explorer les filières
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300">
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

      {/* Sections Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explorez toutes nos sections
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète pour vous accompagner dans votre parcours post-baccalauréat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="group hover:shadow-elegant-xl transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden bg-gradient-card">
                <CardContent className="p-8 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{section.icon}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {section.description}
                    </p>
                    <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                      <Link to={section.path}>
                        Découvrir
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Prêt à construire votre avenir ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoignez des milliers d'étudiants qui ont trouvé leur voie grâce à notre plateforme
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/universities">
                Commencer mon orientation
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/conseils">
                Lire nos conseils
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
