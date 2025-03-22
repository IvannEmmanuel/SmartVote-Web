import React from "react";

function Home({ isLoggedIn, setIsLoggedIn }) {
  return (
    <div className="home-container">
      {isLoggedIn ? (
        <div className="form-container">
          <h1 className="welcome-title">Welcome, Admin!</h1>
          <p className="success-message">You have successfully logged in.</p>
          <button onClick={() => setIsLoggedIn(false)} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h1>Home</h1>
        </div>
      )}
    </div>
  );
}

export default Home;
