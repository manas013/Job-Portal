require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');

const JOBS = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Vercel',
    location: 'San Francisco, CA',
    type: 'full-time',
    experience: 'senior',
    description:
      'Build the next generation of web infrastructure at Vercel. You will own core features of the Vercel Dashboard, collaborate with design systems, and ship experiments to millions of developers worldwide. We value deep product ownership and fast iteration.',
    skills: ['React', 'TypeScript', 'Next.js', 'CSS-in-JS', 'Vite'],
    salary: { min: 160000, max: 210000, currency: 'USD' },
    deadline: new Date('2026-08-01'),
  },
  {
    title: 'Staff Backend Engineer',
    company: 'Stripe',
    location: 'Dublin, Ireland',
    type: 'full-time',
    experience: 'lead',
    description:
      'Design and scale the payment processing infrastructure handling billions of dollars per year. You will lead cross-functional initiatives, set engineering standards, and mentor a team of senior engineers building resilient distributed systems.',
    skills: ['Ruby', 'Go', 'Distributed Systems', 'PostgreSQL', 'gRPC'],
    salary: { min: 180000, max: 250000, currency: 'USD' },
    deadline: new Date('2026-09-15'),
  },
  {
    title: 'Product Designer',
    company: 'Figma',
    location: 'New York, NY',
    type: 'full-time',
    experience: 'mid',
    description:
      'Shape the product design tools used by millions of designers every day. You will partner with engineering and product management to define interaction patterns, run usability studies, and raise the bar for collaborative design experiences.',
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Accessibility'],
    salary: { min: 130000, max: 170000, currency: 'USD' },
    deadline: new Date('2026-07-20'),
  },
  {
    title: 'Full Stack Developer',
    company: 'Notion',
    location: 'Remote',
    type: 'remote',
    experience: 'mid',
    description:
      "Join Notion's core product team to build rich collaborative features that help millions of teams organise their work. You will work across a React/TypeScript frontend and a Node.js/Postgres backend with a strong focus on real-time collaboration.",
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets'],
    salary: { min: 140000, max: 185000, currency: 'USD' },
    deadline: new Date('2026-07-30'),
  },
  {
    title: 'Software Engineer — Infrastructure',
    company: 'Linear',
    location: 'Remote',
    type: 'remote',
    experience: 'senior',
    description:
      'Linear is building the issue tracker that software teams love. We are looking for an infrastructure engineer to own our deployment pipeline, Kubernetes clusters, and observability stack — all while keeping things incredibly fast.',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Go', 'Prometheus'],
    salary: { min: 155000, max: 195000, currency: 'USD' },
    deadline: new Date('2026-08-10'),
  },
  {
    title: 'React Native Developer',
    company: 'Shopify',
    location: 'Toronto, Canada',
    type: 'full-time',
    experience: 'mid',
    description:
      'Build and scale the Shopify mobile app experience reaching millions of merchants globally. You will implement polished UI components, own a feature vertical end-to-end, and improve our shared React Native libraries.',
    skills: ['React Native', 'TypeScript', 'Redux', 'iOS', 'Android'],
    salary: { min: 120000, max: 155000, currency: 'CAD' },
    deadline: new Date('2026-08-25'),
  },
  {
    title: 'iOS Engineer',
    company: 'Airbnb',
    location: 'Seattle, WA',
    type: 'full-time',
    experience: 'senior',
    description:
      'Craft beautiful and fast native iOS experiences used by over 100 million travellers. You will drive architectural decisions for our Swift codebase, run A/B experiments, and work closely with product designers to deliver delightful interactions.',
    skills: ['Swift', 'SwiftUI', 'Combine', 'XCTest', 'CoreData'],
    salary: { min: 165000, max: 220000, currency: 'USD' },
    deadline: new Date('2026-09-01'),
  },
  {
    title: 'Data Engineer',
    company: 'Netflix',
    location: 'Los Angeles, CA',
    type: 'full-time',
    experience: 'senior',
    description:
      'Design petabyte-scale data pipelines that power recommendations for 250 million subscribers. You will own data modelling, streaming ingestion with Kafka, and work with ML teams to deliver reliable feature datasets.',
    skills: ['Python', 'Spark', 'Kafka', 'Flink', 'Airflow', 'Iceberg'],
    salary: { min: 170000, max: 230000, currency: 'USD' },
    deadline: new Date('2026-08-15'),
  },
  {
    title: 'DevOps Engineer',
    company: 'Uber',
    location: 'Amsterdam, Netherlands',
    type: 'full-time',
    experience: 'mid',
    description:
      "Join Uber's platform team to manage CI/CD pipelines, multi-region Kubernetes clusters, and internal developer tooling. You will reduce deployment toil, improve reliability, and help hundreds of engineers ship faster.",
    skills: ['Docker', 'Kubernetes', 'Helm', 'Jenkins', 'Python', 'GCP'],
    salary: { min: 110000, max: 145000, currency: 'EUR' },
    deadline: new Date('2026-07-28'),
  },
  {
    title: 'Machine Learning Engineer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    type: 'full-time',
    experience: 'lead',
    description:
      'Lead ML model development for Feed Ranking and Reels Discovery. You will train large-scale models on billions of data points, deploy to production with strict latency budgets, and collaborate with research scientists on cutting-edge architectures.',
    skills: ['Python', 'PyTorch', 'CUDA', 'Spark', 'Triton', 'Caffe2'],
    salary: { min: 220000, max: 320000, currency: 'USD' },
    deadline: new Date('2026-10-01'),
  },
  {
    title: 'Swift Developer — App Store',
    company: 'Apple',
    location: 'Cupertino, CA',
    type: 'full-time',
    experience: 'senior',
    description:
      "Shape one of the world's largest app distribution platforms. You will own core App Store client features, collaborate with human interface guideline teams, and set standards for SwiftUI adoption across Apple's internal apps.",
    skills: ['Swift', 'SwiftUI', 'Objective-C', 'Instruments', 'Metal'],
    salary: { min: 175000, max: 240000, currency: 'USD' },
    deadline: new Date('2026-09-20'),
  },
  {
    title: 'Cloud Solutions Architect',
    company: 'Google',
    location: 'London, UK',
    type: 'full-time',
    experience: 'lead',
    description:
      'Engage enterprise clients migrating workloads to Google Cloud. You will run architecture workshops, design reference architectures, and guide customers through cloud-native transformation with a focus on GKE and Vertex AI.',
    skills: ['GCP', 'Terraform', 'Kubernetes', 'BigQuery', 'Vertex AI'],
    salary: { min: 150000, max: 200000, currency: 'GBP' },
    deadline: new Date('2026-08-30'),
  },
  {
    title: 'Open Source Platform Engineer',
    company: 'GitHub',
    location: 'Remote',
    type: 'remote',
    experience: 'mid',
    description:
      'Maintain and evolve developer tooling used by 100 million developers. You will contribute to Actions, Codespaces, and the GitHub CLI — building features that empower the global open source community.',
    skills: ['Go', 'Ruby on Rails', 'TypeScript', 'GraphQL', 'Docker'],
    salary: { min: 130000, max: 170000, currency: 'USD' },
    deadline: new Date('2026-07-15'),
  },
  {
    title: 'Backend Developer',
    company: 'Atlassian',
    location: 'Austin, TX',
    type: 'full-time',
    experience: 'entry',
    description:
      'Start your career building the collaboration tools millions of teams rely on — Jira, Confluence, and Trello. You will own microservices, write integration tests, and grow rapidly under the mentorship of experienced engineers.',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'REST', 'AWS'],
    salary: { min: 85000, max: 110000, currency: 'USD' },
    deadline: new Date('2026-07-10'),
  },
  {
    title: 'Frontend Developer',
    company: 'Canva',
    location: 'Sydney, Australia',
    type: 'part-time',
    experience: 'entry',
    description:
      "Build UI components for Canva's design editor — the most used design tool in the world. You will work on a component library, fix accessibility issues, and collaborate with senior engineers to ship features to 170 million users.",
    skills: ['Vue.js', 'TypeScript', 'Storybook', 'CSS', 'Jest'],
    salary: { min: 60000, max: 80000, currency: 'AUD' },
    deadline: new Date('2026-07-05'),
  },
  {
    title: 'Real-time Engineer',
    company: 'Discord',
    location: 'Remote',
    type: 'remote',
    experience: 'senior',
    description:
      'Build the low-latency voice, video, and messaging infrastructure that keeps 500 million users connected. You will work with WebRTC, Elixir/Rust backend systems, and own reliability for real-time communication at global scale.',
    skills: ['Rust', 'Elixir', 'WebRTC', 'WebSockets', 'Redis', 'C++'],
    salary: { min: 160000, max: 215000, currency: 'USD' },
    deadline: new Date('2026-08-20'),
  },
  {
    title: 'Security Engineer',
    company: 'Dropbox',
    location: 'San Francisco, CA',
    type: 'full-time',
    experience: 'mid',
    description:
      'Protect the data of 700 million users by conducting threat modelling, red-team exercises, and security reviews. You will build automated vulnerability scanners, respond to incidents, and lead our secure coding practices initiative.',
    skills: ['Python', 'SIEM', 'Penetration Testing', 'AWS Security', 'OWASP'],
    salary: { min: 145000, max: 185000, currency: 'USD' },
    deadline: new Date('2026-09-10'),
  },
  {
    title: 'API Developer',
    company: 'Twilio',
    location: 'Remote',
    type: 'contract',
    experience: 'mid',
    description:
      'Design and document customer-facing REST and GraphQL APIs for the Twilio Communications Platform. You will collaborate with SDK teams, write OpenAPI specs, run developer feedback sessions, and champion API usability.',
    skills: ['Node.js', 'GraphQL', 'REST', 'OpenAPI', 'TypeScript'],
    salary: { min: 100000, max: 135000, currency: 'USD' },
    deadline: new Date('2026-07-25'),
  },
  {
    title: 'Software Engineering Intern',
    company: 'HubSpot',
    location: 'Cambridge, MA',
    type: 'internship',
    experience: 'entry',
    description:
      "Join HubSpot's summer internship cohort and ship real features to millions of customers. You will be embedded in a product squad, pair with senior engineers, attend workshops, and present your project at the intern showcase.",
    skills: ['Java', 'React', 'MySQL', 'Git', 'Agile'],
    salary: { min: 45000, max: 55000, currency: 'USD' },
    deadline: new Date('2026-06-30'),
  },
  {
    title: 'Platform Engineer',
    company: 'Slack',
    location: 'San Francisco, CA',
    type: 'full-time',
    experience: 'senior',
    description:
      "Scale Slack's developer platform and Bolt SDK ecosystem used by thousands of Slack app developers. You will design platform APIs, own the app sandbox infrastructure, and shape how external developers extend Slack.",
    skills: ['Node.js', 'Python', 'Kafka', 'gRPC', 'AWS', 'TypeScript'],
    salary: { min: 165000, max: 215000, currency: 'USD' },
    deadline: new Date('2026-08-05'),
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Wipe existing data
    await Job.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create demo employer
    const employer = await User.create({
      name: 'Demo Employer',
      email: 'employer@demo.com',
      password: 'demo123456',
      role: 'employer',
      bio: 'Demo employer account for testing the job portal.',
    });

    // Create demo job seeker
    await User.create({
      name: 'Demo Seeker',
      email: 'seeker@demo.com',
      password: 'demo123456',
      role: 'jobseeker',
      bio: 'Looking for exciting opportunities in tech.',
    });

    // Insert all jobs
    const jobDocs = JOBS.map((j) => ({ ...j, postedBy: employer._id }));
    await Job.insertMany(jobDocs);

    console.log(`✅  Seeded ${jobDocs.length} jobs`);
    console.log('   employer@demo.com / demo123456');
    console.log('   seeker@demo.com   / demo123456');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
