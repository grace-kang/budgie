import React, { useMemo } from 'react';
import { DollarSign, Hash, TrendingUp } from 'lucide-react';

import { Transaction } from '../types';
import { round } from '../helpers/money';

type TransactionStatsProps = {
  transactions: Transaction[];
};

export default function TransactionStats({ transactions }: TransactionStatsProps) {
  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const dateRange = useMemo(() => {
    if (transactions.length === 0) {
      return { earliest: null, latest: null };
    }
    const dates = transactions.map((t) => new Date(t.date));
    const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
    const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
    return { earliest, latest };
  }, [transactions]);

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  return (
    <>
      <div className="bento-card bento-card-summary">
        <div className="bento-card-header">
          <DollarSign className="bento-card-icon" strokeWidth={1.5} />
          <h3 className="bento-card-title">Total Amount</h3>
        </div>
        <div className="bento-card-content">
          <div className="bento-card-stat-content">
            <span className="bento-card-stat-value">${round(totalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="bento-card bento-card-stat">
        <div className="bento-card-header">
          <Hash className="bento-card-icon" strokeWidth={1.5} />
          <h3 className="bento-card-title">Transactions</h3>
        </div>
        <div className="bento-card-content">
          <div className="bento-card-stat-content">
            <span className="bento-card-stat-value">{transactions.length}</span>
          </div>
        </div>
      </div>

      <div className="bento-card bento-card-stat">
        <div className="bento-card-header">
          <TrendingUp className="bento-card-icon" strokeWidth={1.5} />
          <h3 className="bento-card-title">Date Range</h3>
        </div>
        <div className="bento-card-content">
          <div className="bento-card-stat-content">
            {dateRange.earliest && dateRange.latest ? (
              <span className="bento-card-stat-value">
                {dateRange.earliest.getTime() === dateRange.latest.getTime()
                  ? formatDateShort(dateRange.earliest)
                  : `${formatDateShort(dateRange.earliest)} - ${formatDateShort(dateRange.latest)}`}
              </span>
            ) : (
              <span className="bento-card-stat-value">—</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
