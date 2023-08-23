// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Customer from './Component/Customer';
import Emi from './Component/emi';

import './App.css';

function App() {
  return (
    // <div className="App">
    //   <h1>Loan App</h1>
      
    //   <Customer />
    
    //   <Emi />
    // </div>
    <Router>
    <div className="App">
      <h1>Loan App</h1>
      <Routes>
        <Route path="/" element={<Customer />} />
        <Route path="/loan-amortization/:customId" element={<Emi />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;