import React from "react";
import { useNavigate } from "react-router-dom";
import './styles/Home.css';

function Home({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false); // ✅ Log out the user
    navigate("/"); // ✅ Redirect to login page
  };

  return (
    <div className="home-container">
      {isLoggedIn ? (
        <div className="form-container">
          <button
            className="add-election"
            onClick={() => navigate("/add-candidate")}
          >
            <h3>ADD CANDIDATE</h3>
          </button>
          <button className="get-specific-election"
          onClick={() => navigate("/get-barangay")}
          >
            <h3>GET CANDIDATE BY BARANGAY</h3>
          </button>
          <button className="update-vote-count">
            <h3>UPDATE VOTE COUNT</h3>
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h1>You are not logged in.</h1>
        </div>
      )}
    </div>
  );
}

export default Home;
