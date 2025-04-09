import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GetBarangay() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [barangays, setBarangays] = useState([]);
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  // Fetch all cities with their barangays
  useEffect(() => {
    const fetchCities = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to access this feature");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/locations/fetchCitiesAll`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("authToken");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch cities");
        }

        const data = await response.json();
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError(err.message || "Failed to load city data");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [apiUrl, navigate]);

  // Update barangays when city changes
  useEffect(() => {
    if (selectedCity) {
      const city = cities.find((c) => c._id === selectedCity);
      if (city) {
        setBarangays(city.barangays);
        setSelectedBarangay(""); // Reset barangay selection when city changes
      }
    } else {
      setBarangays([]);
      setSelectedBarangay("");
    }
  }, [selectedCity, cities]);

  const fetchElections = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to access this feature");
      navigate("/login");
      return;
    }

    if (!selectedCity || !selectedBarangay) {
      setError("Please select both City and Barangay");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/elections/getByLocation/${selectedCity}/${selectedBarangay}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch elections");
      }

      const data = await response.json();
      setElections(data);
    } catch (err) {
      console.error("Error fetching elections:", err);
      setError(err.message || "No elections found for the selected location");
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Search Elections by Location</h2>

      {loading && !selectedCity && <p>Loading cities...</p>}

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="city-select"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Select City:
        </label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
          disabled={loading}
        >
          <option value="">-- Select a City --</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="barangay-select"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Select Barangay:
        </label>
        <select
          id="barangay-select"
          value={selectedBarangay}
          onChange={(e) => setSelectedBarangay(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
          disabled={!selectedCity || loading}
        >
          <option value="">-- Select a Barangay --</option>
          {barangays.map((barangay) => (
            <option key={barangay._id} value={barangay._id}>
              {barangay.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchElections}
        disabled={!selectedCity || !selectedBarangay || loading}
        style={{
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Searching..." : "Search Elections"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {elections.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>Election Results</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              marginTop: "15px",
            }}
          >
            {elections.map((election) => (
              <div
                key={election._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h4 style={{ marginTop: 0, color: "#333" }}>{election.name}</h4>
                <p style={{ color: "#666" }}>{election.description}</p>

                {election.candidates?.length > 0 ? (
                  <div>
                    <h5 style={{ marginBottom: "10px" }}>Candidates:</h5>
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      {election.candidates.map((candidate) => (
                        <li
                          key={candidate._id}
                          style={{
                            marginBottom: "8px",
                            padding: "8px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "4px",
                          }}
                        >
                          <strong>{candidate.name}</strong> - {candidate.party}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No candidates found for this election</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
