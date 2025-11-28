import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ph-salary-frontend.vercel.app",
      "https://ph-salary-frontend-production.up.railway.app"
    ],
    methods: ["GET", "POST"],
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// --- REAL CALCULATION ROUTE ---
app.post("/api/calculate", (req, res) => {
  try {
    const { grossSalary, frequency } = req.body;

    const monthlySalary =
      frequency === "monthly"
        ? grossSalary
        : frequency === "semi-monthly"
        ? grossSalary * 2
        : grossSalary * 4.345;

    // Sample simple tax
    const tax = monthlySalary * 0.10;

    res.json({
      success: true,
      monthlySalary,
      tax,
      netPay: monthlySalary - tax,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// --- IMPORTANT ---
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
