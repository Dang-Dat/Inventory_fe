import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  BrowserRouter as Router, Switch, Route,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import AppRoutes from "./routes/AppRoutes";
function App() {
  return (
    <Router>
      {/* <div>
        <Dashboard />
      </div> */}
      <div className='app-container'>
        <AppRoutes />
      </div>


      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </Router>
  );
}

export default App;
