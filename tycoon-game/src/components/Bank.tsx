import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { takeLoanAsync, repayLoanAsync } from '../store/bankSlice';

import image_bank from './../assets/bank.png';
import InfoCard from './basic/InfoCard';
import { formatCash } from '@/utils/numberFormatter';

const Bank: React.FC = () => {
  const { cash } = useSelector((state: RootState) => state.game);
  const { loan, loanInterest, maxLoan } = useSelector((state: RootState) => state.bank);
  const dispatch: AppDispatch = useDispatch();
  const [loanAmount, setLoanAmount] = useState(0);

  const handleTakeLoan = () => {
    let amountToTake = loanAmount;

    // If the sum of the current debt and the newly entered amount exceeds maxLoan
    if (loan + loanAmount > maxLoan) {
      amountToTake = maxLoan - loan; // Set loan amount to the maximum allowed value
    }

    if (amountToTake > 0) {
      dispatch(takeLoanAsync(amountToTake));
      setLoanAmount(0);
    }
  };

  const handleRepayLoan = () => {
    dispatch(repayLoanAsync(loanAmount));
    setLoanAmount(0);
  };

  const adjustLoanAmount = (amount: number) => {
    setLoanAmount((prevAmount) => Math.max(prevAmount + amount, 0));
  };

  const setCurrentLoanAmount = () => {
    setLoanAmount(loan);
  };

  const setMaxLoanAmount = () => {
    setLoanAmount(maxLoan - loan);
  };

  const isTakeLoanDisabled = loan >= maxLoan || loanAmount <= 0;

  return (
    <div className=''>
      <InfoCard image={image_bank} text={'Bank'} />
      <p>Cash: {formatCash(cash)}</p>
      <p>Loan: {formatCash(loan)}</p>
      <p>Loan Interest: {formatCash(loanInterest)}</p>
      <p>Max Loan Amount: {formatCash(maxLoan)}</p>
      <input
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(Number(e.target.value))}
        className="input input-bordered w-full max-w-xs"
        placeholder="Enter loan amount"
      />
      <div className="mt-2 space-x-2">
        <button className="btn btn-outline" onClick={() => adjustLoanAmount(10000)}>+10k</button>
        <button className="btn btn-outline" onClick={() => adjustLoanAmount(50000)}>+50k</button>
        <button className="btn btn-outline" onClick={() => adjustLoanAmount(500000)}>+500k</button>
        <button className="btn btn-outline" onClick={() => adjustLoanAmount(-10000)}>-10k</button>
        <button className="btn btn-outline" onClick={() => adjustLoanAmount(-50000)}>-50k</button>
        <button className="btn btn-outline" onClick={() => adjustLoanAmount(-500000)}>-500k</button>
        <button className="btn btn-xs btn-outline" onClick={setCurrentLoanAmount}>
          Set Current Loan Amount
        </button>
        <button className="btn btn-xs btn-outline" onClick={setMaxLoanAmount} disabled={loan >= maxLoan}>
          Set Max Loan Amount
        </button>
      </div>
      <div className="mt-4 space-x-2">
        <button className="btn btn-primary" onClick={handleTakeLoan} disabled={isTakeLoanDisabled}>
          Take Loan
        </button>
        <button className="btn btn-secondary" onClick={handleRepayLoan} disabled={loan <= 0 || loanAmount <= 0}>
          Repay Loan
        </button>
      </div>
    </div>
  );
};

export default Bank;
