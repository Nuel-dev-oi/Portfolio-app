import type { Project, ExperienceEntry, SkillCategory } from '@app-types/index';

export const projects: Project[] = [
  {
    titleKey: 'projects.items.auth.title',
    descriptionKey: 'projects.items.auth.description',
    stack: ['Next.js 15', 'TypeScript', 'MongoDB', 'JWT', 'Bcryptjs', 'Nodemailer'],
    github: 'https://github.com/Nuel-dev-oi',
    live: '#',
  },
  {
    titleKey: 'projects.items.quiz.title',
    descriptionKey: 'projects.items.quiz.description',
    stack: ['React', 'TypeScript', 'Tailwind CSS 4.0', 'Vite'],
    github: 'https://github.com/Nuel-dev-oi',
    live: '#',
  },
  {
    titleKey: 'projects.items.tracker.title',
    descriptionKey: 'projects.items.tracker.description',
    stack: ['MongoDB Atlas', 'Express', 'React', 'Node.js', 'Vite'],
    github: 'https://github.com/Nuel-dev-oi',
  },
  {
    titleKey: 'projects.items.jumia.title',
    descriptionKey: 'projects.items.jumia.description',
    stack: ['React', 'Redux', 'Tailwind CSS', 'Open Metro API'],
    github: 'https://github.com/Nuel-dev-oi',
    live: '#',
  },
  {
    titleKey: 'projects.items.terapage.title',
    descriptionKey: 'projects.items.terapage.description',
    stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'TanStack Query', 'NativeWind'],
    inProgress: true,
  },
];

export const experience: ExperienceEntry[] = [
  {
    roleKey: 'experience.items.terapage.role',
    company: 'experience.items.terapage.company',
    periodKey: 'experience.items.terapage.period',
    descriptionKey: 'experience.items.terapage.description',
    bulletKeys: [
      'experience.items.terapage.bullets.0',
      'experience.items.terapage.bullets.1',
      'experience.items.terapage.bullets.2',
      'experience.items.terapage.bullets.3',
      'experience.items.terapage.bullets.4',
      'experience.items.terapage.bullets.5',
      'experience.items.terapage.bullets.6',
    ],
    stack: ['React (Vite)', 'Node.js/Express', 'MongoDB/Mongoose', 'TypeScript'],
  },
  {
    roleKey: 'experience.items.personal.role',
    company: 'experience.items.personal.company',
    periodKey: 'experience.items.personal.period',
    descriptionKey: 'experience.items.personal.description',
    bulletKeys: [
      'experience.items.personal.bullets.0',
      'experience.items.personal.bullets.1',
      'experience.items.personal.bullets.2',
    ],
  },
];

export const skills: SkillCategory[] = [
  {
    labelKey: 'skills.categories.frontend',
    skills: ['Next.js 14/15', 'React.js', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Vite'],
  },
  {
    labelKey: 'skills.categories.mobile',
    skills: ['React Native', 'Expo SDK 51+', 'Expo Router v3', 'NativeWind'],
  },
  {
    labelKey: 'skills.categories.stateUi',
    skills: ['Zustand', 'TanStack Query', 'Redux', 'React Hooks', 'Tailwind CSS 4.0', 'Styled Components', 'Bootstrap'],
  },
  {
    labelKey: 'skills.categories.backend',
    skills: ['Node.js', 'Express.js', 'RESTful API Design', 'JWT', 'Bcryptjs', 'Nodemailer', 'Zod'],
  },
  {
    labelKey: 'skills.categories.database',
    skills: ['MongoDB Atlas', 'Mongoose', 'MySQL', 'Aggregation Pipelines'],
  },
  {
    labelKey: 'skills.categories.tooling',
    skills: ['Git/GitHub', 'Postman', 'Axios', 'ESLint', 'Prettier', 'i18next', 'Jest', 'Vitest'],
  },
];
