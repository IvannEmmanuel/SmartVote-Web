import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddCandidate() {
  const [formData, setFormData] = useState({
    name: "",
    city_id: "",
    baranggay_id: "",
    description: "",
    start_date: "",
    end_date: "",
    candidates: [{ name: "", party: "" }],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCandidateChange = (index, event) => {
    const { name, value } = event.target;
    const newCandidates = [...formData.candidates];
    newCandidates[index][name] = value;
    setFormData({ ...formData, candidates: newCandidates });
  };

  const addCandidate = () => {
    setFormData({
      ...formData,
      candidates: [...formData.candidates, { name: "", party: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_KEY;

    try {
      const response = await fetch(`${apiUrl}/elections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "admin", // Ensure role is sent
        }),
      });

      if (response.ok) {
        alert("Election created successfully!");
        navigate("/");
      } else {
        const errorMessage = await response.text();
        console.error("Error response:", errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <h2>Create Election</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Election Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city_id"
          placeholder="City ID"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="baranggay_id"
          placeholder="Baranggay ID"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="datetime-local"
          name="start_date"
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="end_date"
          onChange={handleChange}
          required
        />

        <h3>Candidates</h3>
        {formData.candidates.map((candidate, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              placeholder="Candidate Name"
              value={candidate.name}
              onChange={(e) => handleCandidateChange(index, e)}
              required
            />
            <input
              type="text"
              name="party"
              placeholder="Party"
              value={candidate.party}
              onChange={(e) => handleCandidateChange(index, e)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addCandidate}>
          Add Another Candidate
        </button>
        <button type="submit">Create Election</button>
      </form>
    </div>
  );
}

export default AddCandidate;
