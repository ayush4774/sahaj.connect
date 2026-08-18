import express from "express";
import Center from "../models/Center.js";

const router = express.Router();

/*
GET /api/centers/nearby?lat=18.5204&lng=73.8567
*/

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers.",
      });
    }

    const centers = await Center.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },

          distanceField: "distanceInMeters",

          spherical: true,

          maxDistance: 50000,
        },
      },

      {
        $addFields: {
          distance: {
            $concat: [
              {
                $toString: {
                  $round: [
                    {
                      $divide: [
                        "$distanceInMeters",
                        1000,
                      ],
                    },
                    1,
                  ],
                },
              },
              " km",
            ],
          },
        },
      },

      {
        $project: {
          distanceInMeters: 0,
          location: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: centers.length,
      centers,
    });
  } catch (error) {
    console.error("Error finding nearby centers:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to find nearby centers.",
    });
  }
});

export default router;