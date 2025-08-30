import universitiesData from '@/data/universities.json';
import { Filiere, University } from '@/types/data';

// Fonction pour créer un slug à partir d'un nom
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäåæ]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõöø]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Fonction pour categoriser automatiquement les filières
function categorizeProgram(programName: string): string {
  const name = programName.toLowerCase();
  
  if (name.includes('médecine') || name.includes('santé') || name.includes('infirmier') || 
      name.includes('obstétric') || name.includes('biomédical') || name.includes('épidémiolog') ||
      name.includes('kinésithérap') || name.includes('nutrition') || name.includes('diététique') ||
      name.includes('pharmacie') || name.includes('assistance sociale')) {
    return 'Sciences de la Santé';
  }
  
  if (name.includes('droit') || name.includes('science politique') || name.includes('politique') ||
      name.includes('juridique') || name.includes('jurisprudence')) {
    return 'Sciences Juridiques et Politiques';
  }
  
  if (name.includes('informatique') || name.includes('génie électrique') || name.includes('electronique') ||
      name.includes('télécom') || name.includes('electrotechnique') || name.includes('mécanique') ||
      name.includes('génie civil') || name.includes('génie') || name.includes('technologie') ||
      name.includes('maintenance') || name.includes('fabrication') || name.includes('productique') ||
      name.includes('biotechnologie') || name.includes('énergie') || name.includes('froid') ||
      name.includes('climatisation') || name.includes('hydraulique') || name.includes('assainissement') ||
      name.includes('architecture') || name.includes('urbanisme') || name.includes('travaux publics')) {
    return 'Sciences et Technologies';
  }
  
  if (name.includes('agriculture') || name.includes('agronomie') || name.includes('production végétale') ||
      name.includes('production animale') || name.includes('foresterie') || name.includes('aquaculture') ||
      name.includes('horticulture') || name.includes('agroalimentaire') || name.includes('semenc') ||
      name.includes('élevage') || name.includes('rural') || name.includes('agro') ||
      name.includes('bio-ressource') || name.includes('conditionnement')) {
    return 'Sciences Agricoles et Environnementales';
  }
  
  if (name.includes('économie') || name.includes('gestion') || name.includes('finance') ||
      name.includes('comptabil') || name.includes('marketing') || name.includes('management') ||
      name.includes('banque') || name.includes('commerce') || name.includes('transport') ||
      name.includes('logistique') || name.includes('ressources humaines') || name.includes('entrepreneur') ||
      name.includes('planification') || name.includes('développement') || name.includes('statistique') ||
      name.includes('assurance') || name.includes('démograph')) {
    return 'Sciences Économiques et de Gestion';
  }
  
  if (name.includes('lettres') || name.includes('anglais') || name.includes('français') ||
      name.includes('allemand') || name.includes('espagnol') || name.includes('chinois') ||
      name.includes('philosophie') || name.includes('histoire') || name.includes('géographie') ||
      name.includes('anthropologie') || name.includes('sociologie') || name.includes('psychologie') ||
      name.includes('éducation') || name.includes('communication') || name.includes('journalisme') ||
      name.includes('audiovisuel') || name.includes('multimédia') || name.includes('patrimoine') ||
      name.includes('archéologie') || name.includes('vulgarisation') || name.includes('langage')) {
    return 'Lettres, Arts et Sciences Humaines';
  }
  
  if (name.includes('mathématiques') || name.includes('physique') || name.includes('chimie') ||
      name.includes('sciences de la vie') || name.includes('sciences de la terre') ||
      name.includes('biologie') || name.includes('microbiologie') || name.includes('hydrobiologie') ||
      name.includes('génétique') || name.includes('biosciences') || name.includes('environnement')) {
    return 'Sciences Exactes et Naturelles';
  }
  
  if (name.includes('art') || name.includes('musique') || name.includes('théâtre') ||
      name.includes('dramaturgie') || name.includes('plastique') || name.includes('cinéma') ||
      name.includes('mode') || name.includes('vêtement') || name.includes('culturel')) {
    return 'Arts et Culture';
  }
  
  if (name.includes('hôtellerie') || name.includes('restauration') || name.includes('tourisme') ||
      name.includes('secrétariat') || name.includes('économie familiale')) {
    return 'Services et Hospitalité';
  }
  
  return 'Autres';
}

// Fonction pour générer une description basique
function generateDescription(programName: string, category: string): string {
  const name = programName.toLowerCase();
  
  if (category === 'Sciences de la Santé') {
    return `Le programme de ${programName} forme des professionnels de santé qualifiés pour répondre aux besoins sanitaires de la population. Cette formation combine théorie et pratique pour développer les compétences nécessaires à l'exercice médical et paramédical.`;
  }
  
  if (category === 'Sciences et Technologies') {
    return `La formation en ${programName} prépare des ingénieurs et techniciens capables de concevoir, développer et maintenir des solutions technologiques innovantes. Cette filière allie sciences fondamentales et applications pratiques.`;
  }
  
  if (category === 'Sciences Agricoles et Environnementales') {
    return `Le programme de ${programName} forme des spécialistes en agriculture moderne et gestion environnementale. Cette formation vise à développer une agriculture durable et productive pour répondre aux défis alimentaires et environnementaux.`;
  }
  
  if (category === 'Sciences Économiques et de Gestion') {
    return `La formation en ${programName} développe les compétences en analyse économique, gestion d'entreprise et prise de décision stratégique. Cette filière prépare aux métiers du management et de l'économie moderne.`;
  }
  
  if (category === 'Lettres, Arts et Sciences Humaines') {
    return `Le programme de ${programName} offre une formation approfondie dans les humanités et sciences sociales. Cette filière développe l'esprit critique, la communication et la compréhension des enjeux socioculturels.`;
  }
  
  if (category === 'Sciences Exactes et Naturelles') {
    return `La formation en ${programName} développe une solide base scientifique et des compétences en recherche. Cette filière prépare aux métiers de la science, de la recherche et de l'enseignement supérieur.`;
  }
  
  return `Le programme de ${programName} offre une formation spécialisée dans ce domaine d'expertise. Cette filière développe les compétences théoriques et pratiques nécessaires à l'exercice professionnel.`;
}

// Fonction pour générer les débouchés
function generateCareerOpportunities(programName: string, category: string): string[] {
  const name = programName.toLowerCase();
  
  if (category === 'Sciences de la Santé') {
    const careers = ['Professionnel de santé', 'Chercheur en santé', 'Consultant médical'];
    if (name.includes('médecine')) careers.push('Médecin', 'Spécialiste médical');
    if (name.includes('infirmier')) careers.push('Infirmier', 'Cadre de santé');
    if (name.includes('pharmacie')) careers.push('Pharmacien', 'Industrie pharmaceutique');
    return careers.slice(0, 5);
  }
  
  if (category === 'Sciences et Technologies') {
    const careers = ['Ingénieur', 'Chef de projet technique', 'Consultant technique'];
    if (name.includes('informatique')) careers.push('Développeur', 'Architecte logiciel');
    if (name.includes('génie civil')) careers.push('Ingénieur BTP', 'Chef de chantier');
    if (name.includes('électr')) careers.push('Ingénieur électricien', 'Technicien électronique');
    return careers.slice(0, 5);
  }
  
  if (category === 'Sciences Agricoles et Environnementales') {
    return ['Ingénieur agronome', 'Conseiller agricole', 'Chef d\'exploitation', 'Technicien agricole', 'Entrepreneur agricole'];
  }
  
  if (category === 'Sciences Économiques et de Gestion') {
    return ['Manager', 'Analyste financier', 'Consultant', 'Entrepreneur', 'Cadre administratif'];
  }
  
  if (category === 'Lettres, Arts et Sciences Humaines') {
    return ['Enseignant', 'Chercheur', 'Communicant', 'Traducteur', 'Médiateur culturel'];
  }
  
  return ['Spécialiste du domaine', 'Consultant', 'Formateur', 'Entrepreneur', 'Cadre'];
}

// Fonction pour générer les compétences requises
function generateRequiredSkills(programName: string, category: string): string[] {
  const baseSkills = ['Rigueur', 'Travail d\'équipe', 'Communication'];
  
  if (category === 'Sciences de la Santé') {
    return [...baseSkills, 'Empathie', 'Résistance au stress'];
  }
  
  if (category === 'Sciences et Technologies') {
    return [...baseSkills, 'Logique', 'Résolution de problèmes'];
  }
  
  if (category === 'Sciences Agricoles et Environnementales') {
    return [...baseSkills, 'Observation', 'Innovation'];
  }
  
  if (category === 'Sciences Économiques et de Gestion') {
    return [...baseSkills, 'Analyse', 'Leadership'];
  }
  
  if (category === 'Lettres, Arts et Sciences Humaines') {
    return [...baseSkills, 'Créativité', 'Esprit critique'];
  }
  
  return [...baseSkills, 'Adaptabilité', 'Curiosité'];
}

// Fonction principale pour générer toutes les filières
export function generateAllFilieres(): Filiere[] {
  const universities = universitiesData as University[];
  const programsMap = new Map<string, {
    category: string;
    universities: string[];
    schoolsOffering: Array<{universityId: string, schoolName: string}>;
  }>();

  // Collecter tous les programmes uniques
  universities.forEach(university => {
    university.schools.forEach(school => {
      school.programs.forEach(program => {
        const trimmedProgram = program.trim();
        if (!programsMap.has(trimmedProgram)) {
          const category = categorizeProgram(trimmedProgram);
          programsMap.set(trimmedProgram, {
            category,
            universities: [],
            schoolsOffering: []
          });
        }
        
        const programData = programsMap.get(trimmedProgram)!;
        if (!programData.universities.includes(university.id)) {
          programData.universities.push(university.id);
        }
        programData.schoolsOffering.push({
          universityId: university.id,
          schoolName: school.name
        });
      });
    });
  });

  // Convertir en filières
  const filieres: Filiere[] = Array.from(programsMap.entries()).map(([programName, data], index) => {
    const slug = createSlug(programName);
    const category = data.category;
    
    return {
      id: `generated-${index + 1}`,
      name: programName,
      slug,
      category,
      description: generateDescription(programName, category),
      duration: '3-5 ans', // Durée par défaut
      careerOpportunities: generateCareerOpportunities(programName, category),
      averageSalary: '250,000 - 800,000 FCFA', // Salaire par défaut
      requiredSkills: generateRequiredSkills(programName, category),
      universities: data.universities,
      image: '/placeholder.svg' // Image par défaut
    };
  });

  return filieres.sort((a, b) => a.name.localeCompare(b.name));
}

// Fonction pour obtenir le nombre d'écoles proposant une filière
export function getSchoolsOfferingFiliere(filiereName: string): Array<{universityName: string, schoolName: string}> {
  const universities = universitiesData as University[];
  const schools: Array<{universityName: string, schoolName: string}> = [];

  universities.forEach(university => {
    university.schools.forEach(school => {
      if (school.programs.includes(filiereName)) {
        schools.push({
          universityName: university.name,
          schoolName: school.name
        });
      }
    });
  });

  return schools;
}

// Fonction pour obtenir les universités proposant une filière
export function getUniversitiesOfferingFiliere(filiereName: string): string[] {
  const universities = universitiesData as University[];
  const universityIds: string[] = [];

  universities.forEach(university => {
    const hasProgram = university.schools.some(school => 
      school.programs.includes(filiereName)
    );
    if (hasProgram && !universityIds.includes(university.id)) {
      universityIds.push(university.id);
    }
  });

  return universityIds;
}