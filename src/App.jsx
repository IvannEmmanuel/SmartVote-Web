import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import Home from "./Home";
import AddCandidate from "./screen/AddCandidate";
import GetBarangay from "./screen/GetBarangay";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const [authToken, setAuthToken] = useState(""); // This is required!

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Login setIsLoggedIn={setIsLoggedIn} setAuthToken={setAuthToken} />
          }
        />
        <Route
          path="/home"
          element={
            <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/get-barangay" element={<GetBarangay />} />
      </Routes>
    </Router>
  );
}

export default App;
