import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import ResetPass from "./Pages/ResetPass";
import Layout from "./Components/Layout";
import Dashboard from "./Pages/Dashboard";
import Appointment from "./Pages/Appointment";
import Drugs from "./Pages/Drugs";
import Invoicing from "./Pages/Invoicing";
import Patient from "./Pages/Patient";
import Prescription from "./Pages/Prescription";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="drugs" element={<Drugs />} />
          <Route path="invoicing" element={<Invoicing />} />
          <Route path="patient" element={<Patient />} />
          <Route path="prescription" element={<Prescription />} />
        </Route>
        <Route index element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="reset-password" element={<ResetPass />} />
      </Routes>
    </Router>
  );
};

export default App;
