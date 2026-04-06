/**
 * Seed script for BioLens database
 * Run with: node seed.js
 *
 * This script initializes the database with:
 * - Default admin user
 * - Sample diatom classes
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");
const DiatomClass = require("./models/DiatomClass");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/biolens";

const DIATOM_CLASSES = [
  {
    name: "Asterionella",
    scientificDescription:
      "Asterionella is a genus of diatoms characterized by a distinctive linear shape and a prominent raphe system. They are commonly found in freshwater environments.",
    environmentalSignificance:
      "Asterionella species are important indicators of water quality and are commonly used in biomonitoring studies. They are sensitive to organic pollution and nutrient enrichment.",
    impacts:
      "High abundance may indicate moderate pollution levels. Often found in slightly acidic to neutral waters. Important for assessing ecosystem health.",
  },
  {
    name: "Cyclotella",
    scientificDescription:
      "Cyclotella is a genus of diatoms with a distinctive circular or wheel-shaped frustule. They are commonly found in freshwater environments.",
    environmentalSignificance:
      "Cyclotella species are versatile indicators used in water quality assessment. Some species tolerate high nutrient levels and pollution.",
    impacts:
      "Presence indicates varying pollution tolerance. Often abundant in eutrophic waters. Used as indicators of nutrient enrichment and organic pollution.",
  },
  {
    name: "Fragilaria",
    scientificDescription:
      "Fragilaria is a genus of diatoms that form distinctive chain-like colonies. They are commonly found in freshwater environments.",
    environmentalSignificance:
      "Fragilaria species are indicators of clean to moderately polluted waters. They are commonly used in water quality assessments.",
    impacts:
      "Indicates relatively clean water conditions. Sensitive to pollution and nutrient enrichment. Important for assessing stream health.",
  },
  {
    name: "Gomphonema",
    scientificDescription:
      "Gomphonema is a genus of stalked diatoms with a distinctive wedge or club shape. They are typically attached to substrates via mucilaginous stalks.",
    environmentalSignificance:
      "Gomphonema species are sensitive indicators of water quality and are particularly useful in assessing oligotrophic to mesotrophic conditions.",
    impacts:
      "Presence indicates good water quality. Sensitive to organic pollution. Often found in fast-flowing streams with high oxygen levels.",
  },
  {
    name: "Navicula",
    scientificDescription:
      "Navicula is a genus of small diatoms with a distinctive amphora or vase-like shape. They are found in various aquatic environments.",
    environmentalSignificance:
      "Navicula species have varying pollution tolerances. Some species are indicators of slightly polluted waters.",
    impacts:
      "Indicates moderate water quality conditions. Some species tolerate pollution. Used in comprehensive biomonitoring assessments.",
  },
  {
    name: "Nitzschia",
    scientificDescription:
      "Nitzschia is a genus of large, robust diatoms with a distinctive linear shape and prominent raphe system. They are commonly found in freshwater environments.",
    environmentalSignificance:
      "Nitzschia species are indicators of acidic to neutral waters. They are relatively tolerant of pollution.",
    impacts:
      "Indicates acidic water conditions. Tolerant of moderate pollution. Often found in oligotrophic waters.",
  },
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await Admin.deleteMany({});
    await DiatomClass.deleteMany({});
    console.log("✓ Cleared existing data");

    // Create default admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    const admin = new Admin({
      username: "admin",
      password: hashedPassword,
    });
    await admin.save();
    console.log(
      "✓ Created default admin (username: admin, password: admin123)",
    );

    // Create diatom classes
    const createdClasses = await DiatomClass.insertMany(DIATOM_CLASSES);
    console.log(`✓ Created ${createdClasses.length} diatom classes`);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\nTest Credentials:");
    console.log("Admin Username: admin");
    console.log("Admin Password: admin123");
    console.log("\nDiatom Classes Created:");
    DIATOM_CLASSES.forEach((dc) => console.log(`  - ${dc.name}`));

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();
