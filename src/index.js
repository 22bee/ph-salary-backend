const express = require('express');
const cors = require('cors');

const app = express();

// Allow frontend URLs to access backend
app.use(cors({
  origin: [
    'http://localhost:5173',                 // local dev
    'https://ph-salary-frontend-tim.vercel.app'   // replace with your Vercel URL
  ]
}));

app.use(express.json());

// Root route for testing
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// GET route for /api/calculate for testing in browser
app.get('/api/calculate', (req, res) => {
  res.send('Backend is running. Use POST to calculate.');
});

// POST route for salary calculation
app.post('/api/calculate', (req, res) => {
  try {
    const { grossSalary, frequency } = req.body;

    if (!grossSalary || !frequency) {
      return res.status(400).json({ error: 'grossSalary and frequency are required' });
    }

    // Deductions
    const sssEmployee = Math.round(grossSalary * 0.045);
    const philhealthEmployee = Math.round(grossSalary * 0.025);
    const pagibigEmployee = Math.round(grossSalary * 0.02);
    const withholdingTax = Math.round(grossSalary * 0.075);

    let net = grossSalary - sssEmployee - philhealthEmployee - pagibigEmployee - withholdingTax;

    // Adjust net salary based on frequency
    let periodNet = net;
    if (frequency === 'semi-monthly') {
      periodNet = net / 2;
    } else if (frequency === 'weekly') {
      periodNet = net / 4; // assuming 4 weeks per month
    }

    res.json({
      gross: grossSalary,
      periodLabel: frequency,
      sssEmployee,
      philhealthEmployee,
      pagibigEmployee,
      withholdingTax,
      net: periodNet
    });

  } catch (err) {
    console.error('Calculation error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Dynamic port for Railway / local
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
