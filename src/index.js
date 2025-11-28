const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Allow frontend to communicate
app.use(cors({
  origin: ['http://localhost:5173', 'https://YOUR_FRONTEND_URL.vercel.app'],
}));

app.use(bodyParser.json());

app.post('/api/calculate', (req, res) => {
  let { grossSalary, frequency } = req.body;

  if (!grossSalary || isNaN(grossSalary)) {
    return res.status(400).json({ message: 'Invalid gross salary' });
  }

  // Adjust gross salary based on frequency
  let adjustedGross = grossSalary;
  switch (frequency) {
    case 'semi-monthly':
      adjustedGross = grossSalary / 2; // split monthly salary into 2
      break;
    case 'daily':
      adjustedGross = grossSalary / 22; // assume 22 workdays/month
      break;
    case 'hourly':
      adjustedGross = grossSalary / 176; // assume 22 workdays * 8 hours
      break;
    default:
      adjustedGross = grossSalary; // monthly
  }

  // Deductions (employee share)
  const sssEmployee = Math.round(adjustedGross * 0.045);
  const philhealthEmployee = Math.round(adjustedGross * 0.025);
  const pagibigEmployee = Math.round(adjustedGross * 0.02);
  const withholdingTax = Math.round(adjustedGross * 0.075);
  const net = adjustedGross - sssEmployee - philhealthEmployee - pagibigEmployee - withholdingTax;

  res.json({
    gross: adjustedGross,
    periodLabel: frequency,
    sssEmployee,
    philhealthEmployee,
    pagibigEmployee,
    withholdingTax,
    net
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
