import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Customer.css'; 
import '../App.css';
// import { Link } from 'react-router-dom';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Customer = () => {


    const [customers, setCustomers] = useState([]);
    const [customId, setId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [gurrantorName, setGurrantorName] = useState('');
    const [status, setStatus] = useState('');
    const [loanAmount, setLoanAmount]= useState('');
    const [interestRate, setInterestRate] =useState('');
    const [tenure, setTenure]= useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [updateCustomerName, setUpdateCustomerName] = useState('');
    const [updateGurrantorName, setUpdateGurrantorName] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');
    const [updateLoanAmount, setUpdateLoanAmount]= useState('');
    const [updateInterestRate, setUpdateInterestRate]=useState('');
    const [updateTenure, setUpdateTenure]= useState('');
    const [selectedCustomer,setSelectedCustomer]= useState('');
  const fetchCustomers = async () => {
    try { 
      const response = await fetch('http://localhost:9000/api/customers',);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setCustomers(data);
     
    } 
    
    catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  
// 
  const createCustomer = async () => {
    try {
      await fetch('http://localhost:9000/api/register', {
        // credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // This indicates that you're sending JSON data
        },
        body: JSON.stringify({ customerName,gurrantorName, status,loanAmount,interestRate,tenure }),
      });
       fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };
  const handleUpdateClick = (customId) => {
    const selectedCustomer = customers.find((customer) => customer.customId === customId);
     // Debugging: Check the selectedCustomer values
 // console.log(selectedCustomer);
    setSelectedCustomerId(customId);
    setUpdateCustomerName(selectedCustomer.customerName);
    setUpdateGurrantorName(selectedCustomer.gurrantorName);
    setUpdateStatus(selectedCustomer.status);
    setUpdateLoanAmount(selectedCustomer.loanAmount);
    setUpdateInterestRate(selectedCustomer.interestRate);
    setUpdateTenure(selectedCustomer.tenure);

     // Store the selected customer in a state variable
  setSelectedCustomer(selectedCustomer);
  };

  const handleUpdateSubmit = async () => {
    try {
      console.log("Updating with values:");
    console.log(updateCustomerName, updateGurrantorName, updateStatus, updateLoanAmount,updateInterestRate, updateTenure);

      const response = await fetch(`http://localhost:9000/api/customers/${selectedCustomerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: updateCustomerName,
          gurrantorName: updateGurrantorName,
          status: updateStatus,
          loanAmount: updateLoanAmount,
          interestRate: updateInterestRate,
          tenure: updateTenure,
        }),
      });
      
      if (response.ok) {
        // Update customer data in the frontend
        const updatedCustomers = customers.map((customer) => {
          if (customer.customId === selectedCustomerId) {
            return {
              ...customer,
              customerName: updateCustomerName,
              gurrantorName: updateGurrantorName,
              status: updateStatus,
              loanAmount: updateLoanAmount,
              interestRate: updateInterestRate,
              tenure: updateTenure,
            };
          }
          return customer;
        });
         
        setCustomers(updatedCustomers);
        
       
        setSelectedCustomerId(null); // Close the update form/modal
      }
       else {
        console.error('Error updating customer:', response.statusText);
      }
      
       // Create an object to store the audit trail data
    const auditTrailData = {
       customId: selectedCustomerId,
      previousData: {
        customerName: selectedCustomer.customerName,
        gurrantorName: selectedCustomer.gurrantorName,
        status: selectedCustomer.status,
        loanAmount: selectedCustomer.loanAmount,
        interestRate: selectedCustomer.interestRate,
        tenure: selectedCustomer.tenure,
      },
      updatedData: {
        customerName: updateCustomerName,
        gurrantorName: updateGurrantorName,
        status: updateStatus,
        loanAmount: updateLoanAmount,
        interestRate: updateInterestRate,
        tenure: updateTenure,
      },
    };
     // Make a POST request to the audit trail endpoint
    
     
     const responseTrail = await fetch(`http://localhost:9000/api/auditTrail/${selectedCustomerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditTrailData),
      
    });
      
    if (response.ok) {
      for(var i=0;i<10000;i++){
      // console.log(auditTrailData.previousData); 
      console.log('Audit trail recorded successfully');
        }
      console.log('Audit trail recorded successfully');
    } else {
      console.error('Error recording audit trail:', responseTrail.statusText);
    }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };
  
  const handleSearch = () => {
    // Filter customers based on the entered ID
    const filteredCustomers = customers.filter(customer => customer.customId.toString()=== customId);
    setCustomers(filteredCustomers);
  };

  const handleSearchAll = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/customers',);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };


  const handleDeleteClick = async (customId) => {
    try {
      await fetch(`http://localhost:9000/api/customers/${customId}`, {
        method: 'DELETE',
      });

      // Update customer data in the frontend by filtering out the deleted customer
      const updatedCustomers = customers.filter(customer => customer.customId !== customId);
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };
  const handleAuditTrail = async (customId) => {
    try {
      await fetch(`http://localhost:9000/api/auditTrailGet/${customId}`, {
        method: 'GET',
      });
       console.log( "Deeepak audiy");
    } catch (error) {
      console.error('Error Auditing customer:', error);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    createCustomer();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
  <div>
    {!selectedCustomerId && (
    <div className="customer-form-container">
      <h2>Create Customer</h2>
      
      <form onSubmit={handleSubmit}>

     <div>
          <label>Customer Name  :</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
     </div>
        
      <div>
            <label>Co-Customer Name:</label>
            <input type='text'
            value={gurrantorName}
            onChange={(e)=> setGurrantorName(e.target.value)}
            required
            />
            
     </div>
        
     <div>
          <label>Status:</label>
          
           <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Closed">Closed</option>
              </select>

     </div>

     <div>
         <label>Loan Amount  :</label>
        <input
           type="number"
           value={loanAmount}
           onChange={(e) => setLoanAmount(e.target.value)}
        />
      </div>
      <div>
         <label>Interest Rate  :</label>
        <input
           type="number"
           value={interestRate}
           onChange={(e) => setInterestRate(e.target.value)}
        />
      </div>

      <div>
         <label>Loan Tenure  :</label>
        <input
           type="number"
           value={tenure}
           onChange={(e) => setTenure(e.target.value)}
        />
      </div>
        <button type="submit">Create Customer</button>
      </form>
 </div>
    )}
 
 {/* <Link to="/loan-amortization">Open Loan Amortization Calculator</Link> Link to Loan Amortization page */}
 {/* handleUpdateSubmit */}
  {selectedCustomerId && (
   <div className="update-modal">
    <h3>Update Customer</h3>
    <form onSubmit={handleUpdateSubmit}>
      <div>
        <label>Customer Name:</label>
        <input
          type="text"
          value={updateCustomerName}
          onChange={(e) => setUpdateCustomerName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Co-Customer Name:</label>
        <input
          type="text"
          value={updateGurrantorName}
          onChange={(e) => setUpdateGurrantorName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Status:</label>
        
         <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Closed">Closed</option>
              </select>
            
      </div>
      
      <div>
        <label>Loan Amount:</label>
        <input
          type="number"
          value={updateLoanAmount}
          onChange={(e) => setUpdateLoanAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Interest Rate:</label>
        <input
          type="number"
          value={updateInterestRate}
          onChange={(e) => setUpdateInterestRate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Tenure:</label>
        <input
          type="number"
          value={updateTenure}
          onChange={(e) => setUpdateTenure(e.target.value)}
          required
        />
      </div>
      

      <button type="submit">Update</button>

    </form>
 </div>

 )}


      
    <div className="customer-table">
        <div className="customer-row header">
          <div className="cell">ID</div>
          <div className="cell">Customer Name</div>
          <div className="cell">Co-Customer Name</div>
          <div className="cell">Status</div>
          <div className="cell">Loan Amount</div>
          <div className='cell'>InterestRate</div>
          <div className="cell">Tenure</div>
          <div className='cell'>Actions</div>
          <div className='cell'>Amortization</div>


        </div>

       
{/* 
     //showing each customers data using map */}
        {customers.map((customer) => (
          
          <div className="customer-row" key={customer.customId}>
            <div className="cell">{customer.customId}</div>
            <div className="cell">{customer.customerName}</div>
            <div className="cell">{customer.gurrantorName}</div>
            <div className="cell"> {customer.status}</div>
            <div className="cell">{customer.loanAmount}</div>
            <div className="cell">{customer.interestRate}</div>
             <div className="cell">{customer.tenure}</div>
             <div className="cell">
              {/* Add the Update button */}
              <button className="update-button" onClick={() => handleUpdateClick(customer.customId)}>
                Update
              </button>
              
              <button
                className="update-button"
                onClick={() => handleDeleteClick(customer.customId)}
                
              >
                Delete
              </button>

              <button
               className="update-button"
               onClick={()=>handleAuditTrail(customer.customId)}>
                AuditTrail
               </button>
          
              </div>
              <div className="cell">
    <Link to={`/loan-amortization/${customer.customId}`}>Amortization</Link>
  </div> 
          </div>

            ))}
    </div>

    
    <div className="search-bar">
        <input
          type="number"
          placeholder="Search by ID"
          value={customId}
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="search-bar">
        <button onClick={handleSearchAll}>GetAllLoanDetails</button>
      </div>
      
 </div>

 
  );

};


export default Customer;





