// calc.js
// Centralize PH payroll rules here. Keep this file short and document where to update official rates.


// NOTE: These formulas are conservative, easy-to-follow approximations and are configurable.
// For official tables and legally accurate payroll, update constants from official agency tables.


const TAX_BRACKETS = [
{ upTo: 250000, base: 0, pct: 0, add: 0 },
{ upTo: 400000, base: 0, pct: 0.15, add: 0 },
{ upTo: 800000, base: 22500, pct: 0.20, add: 0 },
{ upTo: 2000000, base: 102500, pct: 0.25, add: 0 },
{ upTo: 8000000, base: 402500, pct: 0.30, add: 0 },
{ upTo: Infinity, base: 2202500, pct: 0.35, add: 0 }
]


// PhilHealth: premium rate 5% (2024-2025); employee share usually half.
const PHILHEALTH_RATE = 0.05
const PHILHEALTH_EMPLOYEE_SHARE = 0.5
const PHILHEALTH_FLOOR = 10000
const PHILHEALTH_CEILING = 100000


// Pag-IBIG: for most employers and employees: 2% employee (if above 1500), employer 2%
const PAGIBIG_EMP_RATE = 0.02
const PAGIBIG_EMP_RATE_LOW = 0.01 // for salary <= 1500


// SSS: SSS uses a table. For simplicity we use a small approximation function and allow configuration.
// WARNING: Replace this with exact SSS contribution table for production payroll.
function calcSSSEmployee(gross){
// Use Monthly Salary Credit (MSC) banding: floor at 3000 (older), new minimum can be 4000 or 8000 depending on year.
// We'll clamp to 3000-35000 for this example and use approximate employee share 4%.
const m = Math.max(3000, Math.min(35000, gross))
const total = Math.round(m * 0.12) // total contribution approx 12%
const employeeShare = Math.round(total * 0.4) // employee pays ~40% of total (approx)
return employeeShare
}


function calcPhilHealthEmployee(gross){
const mbs = Math.max(PHILHEALTH_FLOOR, Math.min(PHILHEALTH_CEILING, gross))
const premium = mbs * PHILHEALTH_RATE
return Math.round(premium * PHILHEALTH_EMPLOYEE_SHARE)
}


function calcPagIbigEmployee(gross){
if(gross <= 1500) return Math.round(gross * PAGIBIG_EMP_RATE_LOW)
return Math.round(Math.min(gross, 10000) * PAGIBIG_EMP_RATE)
}


function annualizeMonthly(gross, frequency){
// Accepts monthly gross by default.
if(frequency === 'monthly') return gross * 12
if(frequency === 'daily') return gross * 26 // approximate 26 working days
if(frequency === 'hourly') return gross * 8 * 22 // 8h * 22 working days/month *12
return gross * 12
}


function computeWithholdingTax(annualTaxable){
let tax = 0
for(const b of TAX_BRACKETS){
if(annualTaxable <= b.upTo){
if(b.base === 0){
// If previous bracket exists, compute excess over lower bound
// We'll find previous upper bound
const prevIdx = TAX_BRACKETS.indexOf(b) - 1
const lower = prevIdx >= 0 ? TAX_BRACKETS[prevIdx].upTo : 0
tax = Math.max(0, (annualTaxable - lower) * b.pct) + (b.base || 0)
} else {
const prevIdx = TAX_BRACKETS.indexOf(b) - 1
const lower = prevIdx >= 0 ? TAX_BRACKETS[prevIdx].upTo : 0
tax = b.base + (annualTaxable - lower) * b.pct
}
break
}
}
return Math.round(tax)
module.exports = { calculate }}