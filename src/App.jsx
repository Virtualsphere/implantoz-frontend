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
import PatientForm from "./Pages/PatientForm";
import InvoicingForm from "./Pages/InvoiceForm";
import PrescriptionForm from "./Pages/PrescriptionForm";
import DrugsForm from "./Pages/DrugsForm";
import SetPass from "./Pages/SetPass";
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
          <Route path="patient/form" element={<PatientForm />} />
          <Route path="invoicing/form" element={<InvoicingForm />} />
          <Route path="prescription/form" element={<PrescriptionForm />} />
          <Route path="drugs/form" element={<DrugsForm />} />
        </Route>
        <Route index element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="reset-password" element={<ResetPass />} />
        <Route path="set-password" element={<SetPass />} />
      </Routes>
    </Router>
  );
};

export default App;
