import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Center from "./models/Center.js";

dotenv.config();

const centers = [
  {
    name: "Sahaja Yoga Center - Kharadi",
    address: "Kharadi, Pune",
    area: "Kharadi",
    city: "Pune",
    pincode: "411014",
    location: {
      type: "Point",
      coordinates: [73.9475, 18.5512],
    },
    contactNumber: "9876543210",
  },
  {
    name: "Sahaja Yoga Center - Viman Nagar",
    address: "Viman Nagar, Pune",
    area: "Viman Nagar",
    city: "Pune",
    pincode: "411014",
    location: {
      type: "Point",
      coordinates: [73.9107, 18.5679],
    },
    contactNumber: "9876543210",
  },
  {
    name: "Sahaja Yoga Center - Hadapsar",
    address: "Hadapsar, Pune",
    area: "Hadapsar",
    city: "Pune",
    pincode: "411028",
    location: {
      type: "Point",
      coordinates: [73.9260, 18.5089],
    },
    contactNumber: "9876543210",
  },
  {
    name: "Sahaja Yoga Center - Koregaon Park",
    address: "Koregaon Park, Pune",
    area: "Koregaon Park",
    city: "Pune",
    pincode: "411001",
    location: {
      type: "Point",
      coordinates: [73.8937, 18.5362],
    },
    contactNumber: "9876543210",
  },
];

const seedCenters = async () => {
  try {
    await connectDB();

    // Remove old test centers so running this again doesn't create duplicates
    await Center.deleteMany({});

    await Center.insertMany(centers);

    console.log("Centers added successfully");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Error seeding centers:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCenters();