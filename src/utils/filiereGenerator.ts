import { Filiere, University } from '@/types/data';
import universitiesData from '@/data/universities.json';
import filieresDetailsData from '@/data/filieres-details.json';

// Generate all unique filieres from universities data and filieres-details data
export const generateAllFilieres = (): Filiere[] => {
  const uniqueFilieres = new Map<string, Filiere>();

  // First, add all filieres from universities data
  (universitiesData as University[]).forEach((university) => {
    university.schools.forEach((school) => {
      school.programs.forEach((programName) => {
        const slug = programName.toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        if (!uniqueFilieres.has(slug)) {
          // Check if we have detailed data for this filiere
          const detailedData = (filieresDetailsData as Filiere[]).find(f => 
            f.slug === slug || f.name.toLowerCase() === programName.toLowerCase()
          );
          
          if (detailedData) {
            // Use detailed data if available
            uniqueFilieres.set(slug, {
              ...detailedData,
              name: programName, // Keep the original program name
              universities: [university.id]
            });
          } else {
            // Create basic filiere data
            uniqueFilieres.set(slug, {
              id: slug,
              name: programName,
              slug: slug,
              category: "Général",
              description: `Formation en ${programName}`,
              duration: "3 ans",
              careerOpportunities: [`Spécialiste en ${programName}`, "Consultant", "Entrepreneur"],
              averageSalary: "200,000 - 500,000 FCFA",
              requiredSkills: ["Bases académiques solides", "Motivation", "Curiosité"],
              universities: [university.id],
              image: "/images/filieres/default.jpg"
            });
          }
        } else {
          // Add university to existing filiere
          const existing = uniqueFilieres.get(slug)!;
          if (!existing.universities.includes(university.id)) {
            existing.universities.push(university.id);
          }
        }
      });
    });
  });

  return Array.from(uniqueFilieres.values()).sort((a, b) => a.name.localeCompare(b.name));
};

// Get schools offering a specific filiere
export const getSchoolsOfferingFiliere = (filiereName: string): Array<{name: string, location: string}> => {
  const schools: Array<{name: string, location: string}> = [];
  
  (universitiesData as University[]).forEach((university) => {
    university.schools.forEach((school) => {
      const hasFiliere = school.programs.some((program) => {
        // Create slug for program name
        const programSlug = program.toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Create slug for filiere name
        const filiereSlug = filiereName.toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Match by slug or exact name (case insensitive)
        return programSlug === filiereSlug || program.toLowerCase() === filiereName.toLowerCase();
      });
      
      if (hasFiliere) {
        schools.push({
          name: school.name,
          location: `${school.location}, ${university.location}`
        });
      }
    });
  });
  
  return schools;
};

// Helper function to create slug from filiere name
export const createSlug = (name: string): string => {
  return name.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Get filiere details by slug
export const getFiliereBySlug = (slug: string): Filiere | undefined => {
  const allFilieres = generateAllFilieres();
  return allFilieres.find(f => f.slug === slug);
};

// Get all universities offering a specific filiere
export const getUniversitiesOfferingFiliere = (filiereName: string): University[] => {
  const universities: University[] = [];
  
  (universitiesData as University[]).forEach((university) => {
    const hasFiliere = university.schools.some((school) => {
      return school.programs.some((program) => {
        // Create slug for program name
        const programSlug = program.toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Create slug for filiere name
        const filiereSlug = filiereName.toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Match by slug or exact name (case insensitive)
        return programSlug === filiereSlug || program.toLowerCase() === filiereName.toLowerCase();
      });
    });
    
    if (hasFiliere) {
      universities.push(university);
    }
  });
  
  return universities;
};
