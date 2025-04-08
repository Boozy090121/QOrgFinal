const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Assumes the key file is in the same directory

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase Admin initialization error:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

// --- Sample Seed Data --- 

const sampleRoles = [
  { name: 'Site Director', description: 'Oversees all site operations', department: 'Management', permissions: ['admin', 'view_all'], level: 'leadership' },
  { name: 'QA Manager', description: 'Manages Quality Assurance team', department: 'Quality', permissions: ['manage_personnel', 'view_reports'], level: 'leadership' },
  { name: 'Process Engineer', description: 'Optimizes production processes', department: 'Engineering', permissions: ['view_data', 'run_simulations'], level: 'specialist' },
  { name: 'Lab Technician', description: 'Performs quality tests', department: 'Quality', permissions: ['record_results', 'view_tests'], level: 'associate' },
];

const samplePersonnel = [
  { name: 'Alice Johnson', position: 'Site Director', department: 'Management', email: 'alice.j@example.com', phone: '111-222-3333', assignedRole: null, assignedFactory: null, notes: 'Experienced leader.' },
  { name: 'Bob Williams', position: 'QA Manager', department: 'Quality', email: 'bob.w@example.com', phone: '222-333-4444', assignedRole: null, assignedFactory: null, notes: 'Detail-oriented.' },
  { name: 'Charlie Brown', position: 'Process Engineer', department: 'Engineering', email: 'charlie.b@example.com', phone: '333-444-5555', assignedRole: null, assignedFactory: null, notes: 'Focuses on efficiency.' },
  { name: 'Diana Garcia', position: 'Lab Technician', department: 'Quality', email: 'diana.g@example.com', phone: '444-555-6666', assignedRole: null, assignedFactory: null, notes: 'Reliable tester.' },
  { name: 'Ethan Miller', position: 'Lab Technician', department: 'Quality', email: 'ethan.m@example.com', phone: '555-666-7777', assignedRole: null, assignedFactory: null, notes: 'New hire.' },
];

const sampleFactories = [
  { name: 'North Plant', location: 'City A', capacity: 1500, manager: 'Alice Johnson' },
  { name: 'South Wing', location: 'City B', capacity: 800, manager: 'Fred Jones' }, // Example: manager might not be in personnel list
  { name: 'West Annex', location: 'City C', capacity: 1200, manager: 'Alice Johnson' },
];

const samplePhases = [
  { title: 'Phase 1: Assessment & Planning', timeframe: 'Month 1-2', order: 1, activities: [] },
  { title: 'Phase 2: Implementation', timeframe: 'Month 3-6', order: 2, activities: [] },
  { title: 'Phase 3: Training & Rollout', timeframe: 'Month 7-8', order: 3, activities: [] },
  { title: 'Phase 4: Stabilization & Monitoring', timeframe: 'Month 9-12', order: 4, activities: [] },
];

// --- Seeding Function --- 

const seedDatabase = async () => {
  console.log('Starting database seeding...');

  const now = admin.firestore.FieldValue.serverTimestamp();

  // Seed Roles
  console.log('Seeding roles...');
  const rolesCollection = db.collection('roles');
  for (const role of sampleRoles) {
    try {
      await rolesCollection.add({ ...role, createdAt: now, updatedAt: now });
      console.log(`  Added role: ${role.name}`);
    } catch (error) {
      console.error(`  Error adding role ${role.name}:`, error);
    }
  }

  // Seed Personnel
  console.log('Seeding personnel...');
  const personnelCollection = db.collection('personnel');
  for (const person of samplePersonnel) {
    try {
      await personnelCollection.add({ ...person, createdAt: now, updatedAt: now });
      console.log(`  Added personnel: ${person.name}`);
    } catch (error) {
      console.error(`  Error adding personnel ${person.name}:`, error);
    }
  }

  // Seed Factories
  console.log('Seeding factories...');
  const factoriesCollection = db.collection('factories');
  for (const factory of sampleFactories) {
    try {
      await factoriesCollection.add({ ...factory, createdAt: now, updatedAt: now });
      console.log(`  Added factory: ${factory.name}`);
    } catch (error) {
      console.error(`  Error adding factory ${factory.name}:`, error);
    }
  }

  // Seed Phases
  console.log('Seeding phases...');
  const phasesCollection = db.collection('timeline'); // Collection name is 'timeline'
  for (const phase of samplePhases) {
    try {
      // We don't store activities array directly in phase doc usually
      const { activities, ...phaseData } = phase; 
      await phasesCollection.add({ ...phaseData, createdAt: now, updatedAt: now });
      console.log(`  Added phase: ${phase.title}`);
      // In a real app, activities might be a subcollection
    } catch (error) {
      console.error(`  Error adding phase ${phase.title}:`, error);
    }
  }

  console.log('Database seeding completed.');
};

// Run the seeding function
seedDatabase().catch(error => {
  console.error('Unhandled error during seeding:', error);
  process.exit(1);
}); 