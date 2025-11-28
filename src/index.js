const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Allow frontend on localhost and Vercel to talk to backend
app.use(cors({
  origin: [
    'http://localhost:5173',                 // local dev
    'https://ph-salary-frontend-tim.vercel.app'   // live frontend URL
  ]
}));

app.use(bodyParser.json());

// Optional GET route for testing in browser
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/api/calculate', (req, res) => {
  res.send('Backend is running. Use POST to calculate.');
});

// POST route for salary calculation
app.post('/api/calculate', (req, res) => {
  const { grossSalary, frequency } = req.body;

  // Calculate government-mandated deductions
  const sssEmployee = Math.round(grossSalary * 0.045);
  const philhealthEmployee = Math.round(grossSalary * 0.025);
  const pagibigEmployee = Math.round(grossSalary * 0.02);
  const withholdingTax = Math.round(grossSalary * 0.075);

  // Net salary, adjusted for semi-monthly
  let net = grossSalary - sssEmployee - philhealthEmployee - pagibigEmployee - withholdingTax;
  if (frequency === 'semi-monthly') net = net / 2;

  res.json({
    gross: grossSalary,
    periodLabel: frequency,
    sssEmployee,
    philhealthEmployee,
    pagibigEmployee,
    withholdingTax,
    net
  });
});

// Use dynamic port for Railway / local
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listening on port', port));
