import React, { useState } from "react";
import { Budget } from "../api/Api";

interface BudgetParams {
  name: string;
  total: number;
  month_id: number;
}

interface Props {
  monthId: number;
  initialBudget?: {
    name?: string;
    total?: number;
    errors?: string[];
  };
  // optional submit handler; if omitted the form will just log the payload
  onSubmit?: (data: BudgetParams) => Promise<Budget>;
  submitLabel?: string;
}

export default function BudgetForm({
  monthId,
  initialBudget,
  onSubmit,
  submitLabel = "Create",
}: Props) {
  const [name, setName] = useState(initialBudget?.name ?? "");
  const [total, setTotal] = useState<number | "">(initialBudget?.total ?? "");
  const [errors, setErrors] = useState<string[]>(initialBudget?.errors ?? []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const payload: BudgetParams = {
      name,
      total: Number(total || 0),
      month_id: monthId,
    };

    if (onSubmit) {
      try {
        await onSubmit(payload);
      } catch (err: any) {
        // if caller throws an object with .errors array, surface it
        if (Array.isArray(err?.errors)) setErrors(err.errors);
        else setErrors([String(err)]);
      }
    } else {
      // no-op default behavior
      console.log("BudgetForm submit", payload);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form">
        <div className="budget-name-input">
          <input
            type="text"
            name="name"
            placeholder="Name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="budget-total-input">
          <input
            type="number"
            name="total"
            placeholder="Limit"
            value={total === "" ? "" : String(total)}
            onChange={(e) => setTotal(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>

        <input type="hidden" name="month_id" value={monthId} />

        <div className="hidden-submit">
          <button type="submit">{submitLabel}</button>
        </div>

        {errors.length > 0 && (
          <div className="form-errors">
            {errors.map((msg, i) => (
              <span key={i}>{msg}</span>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
