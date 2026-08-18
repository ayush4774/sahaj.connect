import mongoose from "mongoose";

const centerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      default: "",
    },

    timing: {
      type: String,
      default: "",
    },

    weekendTiming: {
      type: String,
      default: "",
    },

    todayTime: {
      type: String,
      default: "",
    },

    isToday: {
      type: Boolean,
      default: false,
    },

    coordinator: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    whatsapp: {
      type: String,
      default: "",
    },

    languages: {
      type: [String],
      default: [],
    },

    markerType: {
      type: String,
      enum: [
        "regular",
        "program",
        "festival",
        "today",
        "workshop",
      ],
      default: "regular",
    },

    img: {
      type: String,
      default: "",
    },

    // MongoDB GeoJSON coordinates
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Required for nearby queries
centerSchema.index({
  location: "2dsphere",
});

export default mongoose.model("Center", centerSchema);