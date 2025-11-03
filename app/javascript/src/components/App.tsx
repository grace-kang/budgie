import React, { useEffect } from 'react';
import Months from './Months';
import { useMonths } from '../hooks/useMonths';

export default function App() {
  return (
    <div>
      <Months />
    </div>
  );
}
