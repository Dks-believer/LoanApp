import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import './Customer.css';
import { Link } from 'react-router-dom';

function Emi() {
  const { customId } = useParams();
 // console.log('Custom ID:', customId); 
  const [customerDetails, setCustomerDetails] = useState({});
  const [amortizationData, setAmortizationData] = useState([]);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    async function fetchCustomerDetails() {
      try {
        const response = await fetch(`http://localhost:9000/api/customers/${customId}`);
        if (response.ok) {
          const customerData = await response.json();
          setCustomerDetails(customerData);
        }
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    }
    fetchCustomerDetails();
  }, [customId]);

  const calculateAmortization = () => {
    const loanAmount = customerDetails.loanAmount;
    console.log(loanAmount);
    const interestRate = customerDetails.interestRate / 100;
    const loanTerm = customerDetails.tenure;
    const monthlyInterestRate = interestRate / 12;
    const numPayments = loanTerm * 12;

    const monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numPayments));

    const amortizationSchedule = [];
    let remainingBalance = loanAmount;

    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;

      amortizationSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance,
      });

      remainingBalance -= principalPayment;
    }

    setAmortizationData(amortizationSchedule);
    // Calculate the total interest amount
    const totalInterestAmount = amortizationSchedule.reduce((total, entry) => total + entry.interest, 0);
    setTotalInterest(totalInterestAmount);
  };

  return (
    <div className="App">
        <Link to="/" className="back-link">Go Back to Home</Link>

      <h1>Loan Amortization for Customer {customId}</h1>
      {Object.keys(customerDetails).length > 0 && (
        <div>
          <p>Customer Name: {customerDetails.customerName}</p>
          <p>Loan Amount: &#8377;{customerDetails.loanAmount}</p>
          <p>Interest Rate: {customerDetails.interestRate}%</p>
          <p>Tenure: {customerDetails.tenure} years</p>
        </div>
      )}
      {totalInterest > 0 && (
        <div>
          <p>Total Interest Amount: &#8377;{totalInterest.toFixed(2)}</p>
        </div>
      )}
      
      {Object.keys(customerDetails).length > 0 && (
        <div>
          <button onClick={calculateAmortization}>Calculate Amortization</button>
        </div>
      )}

      {amortizationData.length > 0 && (
        <div className='customer-table'>
          <h2>Amortization Schedule</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.month}</td>
                  <td>&#8377;{entry.payment.toFixed(2)}</td>
                  <td>&#8377;{entry.principal.toFixed(2)}</td>
                  <td>&#8377;{entry.interest.toFixed(2)}</td>
                  <td>&#8377;{entry.remainingBalance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {totalInterest > 0 && (
        <div>
          <p>Total Interest Amount: &#8377;{totalInterest.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default Emi;


