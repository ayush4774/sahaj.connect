import Center from "../models/Center.js";

// Get all centers or search centers
export const getCenters = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {
      isActive: true,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { pincode: { $regex: search, $options: "i" } },
      ];
    }

    const centers = await Center.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: centers.length,
      centers,
    });
  } catch (error) {
    console.error("Get centers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch centers",
    });
  }
};


// Find centers near a location
export const getNearbyCenters = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    const centers = await Center.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },

          distanceField: "distance",

          maxDistance: 50000,

          spherical: true,

          query: {
            isActive: true,
          },
        },
      },

      {
        $addFields: {
          distanceInKm: {
            $round: [
              {
                $divide: ["$distance", 1000],
              },
              2,
            ],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: centers.length,
      centers,
    });
  } catch (error) {
    console.error("Nearby centers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to find nearby centers",
    });
  }
};