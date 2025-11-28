// backend/src/index.js
const express = require('express');
const cors = require('cors');

const app = express();

// Allow frontend URLs (dev + production) — update VERCEL_URL to your real frontend URL later.
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ph-salary-frontend-asher.vercel.app/'
  ]
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.post('/api/calculate', (req, res) => {
  try {
    const { grossSalary, frequency } = req.body;
    if (!grossSalary || !frequency) {
      return res.status(400).json({ error: 'grossSalary and frequency required' });
    }

    const sssEmployee = Math.round(grossSalary * 0.045);
    const philhealthEmployee = Math.round(grossSalary * 0.025);
    const pagibigEmployee = Math.round(grossSalary * 0.02);
    const withholdingTax = Math.round(grossSalary * 0.075);

    let net = grossSalary - sssEmployee - philhealthEmployee - pagibigEmployee - withholdingTax;
    if (frequency === 'semi-monthly') {
      net = net / 2;
    }

    res.json({
      gross: grossSalary,
      periodLabel: frequency,
      sssEmployee,
      philhealthEmployee,
      pagibigEmployee,
      withholdingTax,
      net
    });
  } catch (err) {
    console.error('Calculation error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Use dynamic port — necessary on Railway
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
