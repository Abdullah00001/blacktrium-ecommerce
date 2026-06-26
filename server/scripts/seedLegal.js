const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '..', '.env'),
});
const mongoose = require('mongoose');

// Define Enums locally matching your TypeScript types
const UserType = {
  USER: 'user',
  ORGANIZER: 'organizer',
  MERCHANT: 'merchant',
};

const ContentType = {
  PRIVACY: 'privacy',
  TERMS: 'terms',
  ABOUT: 'about',
  MISSION: 'mission',
};

// Define Schema raw to avoid TypeScript compilation issues in pure Node scripts
const LegalSchema = new mongoose.Schema(
  {
    targetRole: {
      type: String,
      enum: Object.values(UserType),
      required: true,
      index: true,
    },
    contentType: {
      type: String,
      enum: Object.values(ContentType),
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const LegalModel =
  mongoose.models.Legal || mongoose.model('Legal', LegalSchema);

// Helper to generate dynamic user-friendly titles
const formatTitle = (type, role) => {
  const titles = {
    [ContentType.PRIVACY]: 'Privacy Policy',
    [ContentType.TERMS]: 'Terms & Conditions',
    [ContentType.ABOUT]: 'About Us',
    [ContentType.MISSION]: 'Mission Statement',
  };
  return `${titles[type]}`;
};

// Fallback HTML content for the rich text editor
const getPlaceholderContent = (title) => {
  return `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Posuere leo nunc eu phasellus consequat egestas diam mattis magna. Dui nullam gravida turpis fames metus ultrices sed mattis. </p>
    <p>In tristique sapien etiam orci convallis. Viverra mauris consectetur integer nisl pellentesque potenti pharetra. Cras gravida ut ullamcorper urna mauris ultricies. Ridiculus nullam nec sodales lacus proin sit dictumst id.</p>
  `.trim();
};

const seedLegalDocuments = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Missing Environment Variable: MONGODB_URI');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    console.log('Seeding Default Legal & Settings Documents...');
    console.log('--------------------------------------------\n');

    let createdCount = 0;
    let skippedCount = 0;

    // Loop through every combination of User Type and Content Type
    for (const role of Object.values(UserType)) {
      for (const type of Object.values(ContentType)) {
        // Check if this specific matrix document already exists
        const existingDoc = await LegalModel.findOne({
          targetRole: role,
          contentType: type,
        });

        if (!existingDoc) {
          const displayTitle = formatTitle(type, role);

          await LegalModel.create({
            targetRole: role,
            contentType: type,
            title: displayTitle,
            content: getPlaceholderContent(displayTitle),
          });

          console.log(`+ Created: [${role.toUpperCase()}] -> ${displayTitle}`);
          createdCount++;
        } else {
          console.log(
            ` snapshot_id ⚠ Skipped (Already Exists): [${role.toUpperCase()}] -> ${existingDoc.title}`
          );
          skippedCount++;
        }
      }
    }

    console.log('\n--------------------------------------------');
    console.log(
      `✓ Seeding complete! Created: ${createdCount}, Skipped: ${skippedCount}`
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error during seeding:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedLegalDocuments();
