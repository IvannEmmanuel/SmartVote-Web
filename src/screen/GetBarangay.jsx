import React, { useState } from "react";

export default function GetBarangay() {
  const [cityId, setCityId] = useState("");
  const [barangayId, setBarangayId] = useState("");
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");

  const fetchElections = async () => {
    if (!cityId || !barangayId) {
      setError("Please enter both City ID and Barangay ID");
      return;
    }
    setError(""); // Clear previous errors

    try {
      const response = await fetch(
        `http://localhost:3000/elections/getByBaranggay/${cityId}/${barangayId}`
      );
      if (!response.ok) throw new Error("Failed to fetch elections");

      const data = await response.json();
      setElections(data);
    } catch (err) {
      console.error("Error fetching elections:", err);
      setError("No elections found for the given City ID and Barangay ID");
    }
  };

  return (
    <div>
      <h2>Search Elections by City & Barangay</h2>

      <input
        type="text"
        placeholder="Enter City ID"
        value={cityId}
        onChange={(e) => setCityId(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Barangay ID"
        value={barangayId}
        onChange={(e) => setBarangayId(e.target.value)}
      />

      <button onClick={fetchElections}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Elections</h3>
      {elections.length > 0 ? (
        <ul>
          {elections.map((election) => (
            <li key={election._id}>
              <strong>{election.name}</strong> - {election.description}
              <ul>
                <h4>Candidates:</h4>
                {election.candidates.length > 0 ? (
                  election.candidates.map((candidate) => (
                    <li key={candidate._id}>
                      <strong>{candidate.name}</strong> ({candidate.party})
                    </li>
                  ))
                ) : (
                  <p>No candidates found</p>
                )}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No elections found</p>
      )}
    </div>
  );
}
