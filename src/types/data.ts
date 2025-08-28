export interface University {
  id: string;
  name: string;
  type: "publique" | "privee";
  city: string;
  description: string;
  image: string;
  website: string;
  established: string;
  studentCount: string;
  schools: School[];
}

export interface School {
  id: string;
  name: string;
  description: string;
  programs: string[];
}

export interface Filiere {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  duration: string;
  careerOpportunities: string[];
  averageSalary: string;
  requiredSkills: string[];
  universities: string[];
  image: string;
}

export interface Concours {
  id: string;
  title: string;
  institution: string;
  deadline: string;
  examDate: string;
  description: string;
  requirements: string[];
  documentsNeeded: string[];
  applicationLink: string;
}

export interface Stage {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  domain: string;
  description: string;
  requirements: string[];
  applicationDeadline: string;
  contactEmail: string;
}

export interface Formation {
  id: string;
  title: string;
  instructor: string;
  price: number;
  duration: string;
  level: string;
  description: string;
  objectives: string[];
  content: string[];
  image: string;
}

export interface Conseil {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  image: string;
  tags: string[];
}