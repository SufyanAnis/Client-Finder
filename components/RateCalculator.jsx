"use client";

import { useMemo, useState } from "react";

const CURRENCIES = ["USD", "GBP", "EUR", "AED", "CAD", "AUD", "PKR", "INR"];

const fmt = (n, cur) => {
  if (!Number.isFinite(n) || n <= 0) return "—";
  try { return new Intl.NumberFormat("en", { style: "currency", currency: cur, maximumFractionDigits: n < 100 ? 2 : 0 }).format(n); }
  catch { return Math.round(n).toLocaleString() + " " + cur; }
};

function Field({ label, hint, value, onChange, suffix, step = 1 }) {
  return (
    <label className="calc-f">
      <span className="label">{label}</span>
      <span className="calc-in">
        <input className="inp" type="number" inputMode="decimal" min="0" step={step} value={value} onChange={(e) => onChange(e.target.value)} />
        {suffix && <span className="calc-suf">{suffix}</span>}
      </span>
      {hint && <span className="calc-hint">{hint}</span>}
    </label>
  );
}

export default function RateCalculator() {
  const [cur, setCur] = useState("USD");
  const [income, setIncome] = useState(60000);
  const [expenses, setExpenses] = useState(6000);
  const [tax, setTax] = useState(25);
  const [weeks, setWeeks] = useState(46);
  const [hours, setHours] = useState(40);
  const [billable, setBillable] = useState(60);
  const [buffer, setBuffer] = useState(15);
  const [dayHours, setDayHours] = useState(7);

  const r = useMemo(() => {
    const n = (v) => Math.max(Number(v) || 0, 0);
    const gross = (n(income) + n(expenses)) / Math.max(1 - n(tax) / 100, 0.05);
    const billableHours = n(weeks) * n(hours) * (n(billable) / 100);
    const floor = billableHours > 0 ? gross / billableHours : 0;
    const target = floor * (1 + n(buffer) / 100);
    return { gross, billableHours, floor, target, day: target * n(dayHours), month: gross * (1 + n(buffer) / 100) / 12 };
  }, [income, expenses, tax, weeks, hours, billable, buffer, dayHours]);

  return (
    <div className="panel calc">
      <div className="calc-grid">
        <label className="calc-f">
          <span className="label">Currency</span>
          <select className="inp" value={cur} onChange={(e) => setCur(e.target.value)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <Field label="Take-home income you want / year" value={income} onChange={setIncome} suffix={cur} step={1000} />
        <Field label="Business expenses / year" hint="Software, hardware, internet, coworking, accountant, insurance" value={expenses} onChange={setExpenses} suffix={cur} step={500} />
        <Field label="Tax rate (approx.)" hint="Your effective rate, roughly. Check with a local accountant." value={tax} onChange={setTax} suffix="%" />
        <Field label="Working weeks / year" hint="52 minus holidays, sick days and public holidays" value={weeks} onChange={setWeeks} suffix="wks" />
        <Field label="Hours worked / week" value={hours} onChange={setHours} suffix="hrs" />
        <Field label="Billable share of hours" hint="Time spent on paid client work, not sales/admin. 50–70% is common for freelancers." value={billable} onChange={setBillable} suffix="%" />
        <Field label="Safety buffer" hint="Covers quiet months, late payers and scope creep" value={buffer} onChange={setBuffer} suffix="%" />
        <Field label="Hours in a billable day" value={dayHours} onChange={setDayHours} suffix="hrs" />
      </div>

      <div className="calc-out" aria-live="polite">
        <div className="calc-big">
          <div className="label">Recommended minimum hourly rate</div>
          <div className="calc-n">{fmt(r.target, cur)}</div>
          <div className="calc-hint">Break-even floor (no buffer): {fmt(r.floor, cur)} / hour</div>
        </div>
        <div className="calc-row">
          <div><div className="label">Day rate</div><div className="calc-m">{fmt(r.day, cur)}</div></div>
          <div><div className="label">Monthly revenue needed</div><div className="calc-m">{fmt(r.month, cur)}</div></div>
          <div><div className="label">Billable hours / year</div><div className="calc-m">{Math.round(r.billableHours).toLocaleString()}</div></div>
        </div>
        <p className="fine">
          Formula: (take-home income + expenses) ÷ (1 − tax rate) ÷ billable hours, plus your buffer. This is the least you can charge
          to hit your income goal — your market rate may be higher. Tax and expenses are your own estimates; this isn't financial advice.
        </p>
      </div>
    </div>
  );
}
