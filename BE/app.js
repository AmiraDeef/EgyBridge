// import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

// activation
require("dotenv").config();

// Routes
const authRoute = require("./routes/authRoute");
const tripsRoutes = require("./routes/tripRoute");
const bookingRoutes = require("./routes/bookingRoute");
const reviewRoutes = require("./routes/reviewRoute");
const emergencyRoutes = require("./routes/emergencyRoute");
const tripPlanRoutes = require("./routes/tripPlanRoute");
const placeRoutes = require("./routes/placeRoute");
const externalServiceRoutes = require("./routes/externalServiceRoute");

// Error middleware
const errorMiddleware = require("./middlewares/globalError");

const app = express();

// ============================================================
// Middlewares
// ============================================================

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));

// ============================================================
// Chatbot & AI Integration
// ============================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ============================================================
// Load Tourism Database
// ============================================================

let tourismDatabase = {};

try {
  const jsonPath = path.join(__dirname, "data", "egypt_data.json");

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    tourismDatabase = JSON.parse(rawData);
    console.log("Egypt tourism database loaded successfully.");
  } else {
    console.log("Tourism database file not found:", jsonPath);
  }
} catch (err) {
  console.log("JSON Data file not loaded:", err.message);
}

// ============================================================
// Chatbot Endpoint
// ============================================================

app.post("/api/user/chat", async (req, res, next) => {
  try {
    const { message, userName } = req.body;

    // Validate message
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        message: "Please provide a valid message.",
      });
    }

    const systemInstruction = `
You are an expert Egyptian Tourist Guide assistant for the platform EGI RISE.
You are speaking to the traveler named: "${userName || "Traveler"}"

Use the following tourism database to answer the user's questions accurately.

TOURISM DATABASE:
${JSON.stringify(tourismDatabase)}

Instructions:
- Be clear, welcoming, and concise.
- Answer as an Egyptian tourism expert.
- Use line breaks and bullet points when useful.
- If the user asks about tickets, prices, opening hours, locations, or attractions, use the provided tourism database whenever the information is available.
- Do not invent information that is available in the database.
- If the database does not contain the requested information, clearly say that the information is not available.
`;

    // ========================================================
    // Gemini Request Fix
    // ========================================================

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // ========================================================
    // Send Response
    // ========================================================

    res.status(200).json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    next(error);
  }
});

// ============================================================
// Application Routes
// ============================================================

app.use("/api/user", authRoute);
app.use("/api/user/trips", tripsRoutes);
app.use("/api/user/bookings", bookingRoutes);
app.use("/api/user/reviews", reviewRoutes);
app.use("/api/user/emergency", emergencyRoutes);
app.use("/api/user/trip-plans", tripPlanRoutes);
app.use("/api/user/places", placeRoutes);
app.use("/api/user/services", externalServiceRoutes);

// ============================================================
// MongoDB Connection
// ============================================================

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo database is connected  (o_o)");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

dbConnection();

// ============================================================
// Global Error Middleware
// ============================================================

app.use(errorMiddleware);

// ============================================================
// Start Server
// ============================================================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});