import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ph-salary-frontend.vercel.app",
      "https://ph-salary-frontend-production.vercel.app"
    ],
    methods: ["GET", "POST"],
  })
);

// Test route (GET /)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// API route (POST /api/calculate)
app.post("/api/calculate", (req, res) => {
  try {
    const { grossSalary, frequency } = req.body;

    let monthlySalary = grossSalary;

    if (frequency === "semi-monthly") {
      monthlySalary = grossSalary * 2;
    } else if (frequency === "weekly") {
      monthlySalary = grossSalary * 4.345;
    }

    const tax = monthlySalary * 0.10;

    res.json({
      success: true,
      monthlySalary,
      tax,
      netPay: monthlySalary - tax,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// IMPORTANT — Railway needs this
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
