import filiereUniqueData from '@/data/filieres-unique.json';
import universitiesData from '@/data/universities.json';
import { Filiere, University } from '@/types/data';

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
  
  // Correspondance partielle (si le nom de la filière est contenu dans le programme)
  if (normalizedProgram.includes(normalizedFiliere) || normalizedFiliere.includes(normalizedProgram)) {
    return true;
  }
  
  return false;
}

// Fonction principale pour obtenir toutes les filières uniques
export function generateAllFilieres(): Filiere[] {
  const programToUniversities: { [key: string]: string[] } = {};

  // Extraire le mapping programme -> universités depuis les données d'universités
  universitiesData.forEach(university => {
    university.schools.forEach(school => {
      school.programs.forEach(program => {
        const normalizedProgram = normalizeString(program);
        
        if (!programToUniversities[normalizedProgram]) {
          programToUniversities[normalizedProgram] = [];
        }
        if (!programToUniversities[normalizedProgram].includes(university.id)) {
          programToUniversities[normalizedProgram].push(university.id);
        }
      });
    });
  });

  // Mapper les données statiques de filières avec les assignations d'universités dynamiques
  const filieres: Filiere[] = filiereUniqueData.map(filiere => {
    const normalizedName = normalizeString(filiere.name);
    return {
      ...filiere,
      universities: programToUniversities[normalizedName] || []
    };
  });

  return filieres.sort((a, b) => a.name.localeCompare(b.name));
}

// Fonction pour obtenir les écoles proposant une filière
export function getSchoolsOfferingFiliere(filiereName: string): Array<{universityName: string, schoolName: string}> {
  const universities = universitiesData as University[];
  const schools: Array<{universityName: string, schoolName: string}> = [];

  universities.forEach(university => {
    university.schools.forEach(school => {
      const hasMatchingProgram = school.programs.some(program => 
        namesMatch(filiereName, program)
      );
      
      if (hasMatchingProgram) {
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
      school.programs.some(program => namesMatch(filiereName, program))
    );
    if (hasProgram && !universityIds.includes(university.id)) {
      universityIds.push(university.id);
    }
  });

  return universityIds;
}

// Export des fonctions utilitaires pour les autres composants
export { normalizeString, namesMatch };