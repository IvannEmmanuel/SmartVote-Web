import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddCandidate.css"; // Create this CSS file

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
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/locations/fetchCitiesAll`, {
          headers: { Authorization: token },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("authToken");
            return;
          }
          throw new Error("Failed to fetch cities");
        }

        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [apiUrl, navigate]);

  // Update barangays when city changes
  useEffect(() => {
    if (formData.city_id) {
      const city = cities.find((c) => c._id === formData.city_id);
      setBarangays(city?.barangays || []);
      setFormData((prev) => ({ ...prev, baranggay_id: "" }));
    } else {
      setBarangays([]);
    }
  }, [formData.city_id, cities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCandidateChange = (index, e) => {
    const { name, value } = e.target;
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

  const removeCandidate = (index) => {
    if (formData.candidates.length <= 1) return;
    const newCandidates = formData.candidates.filter((_, i) => i !== index);
    setFormData({ ...formData, candidates: newCandidates });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      return;
    }

    // Filter empty candidates
    const filledCandidates = formData.candidates.filter(
      (c) => c.name.trim() && c.party.trim()
    );

    if (!filledCandidates.length) {
      setError("Please add at least one candidate");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/elections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          ...formData,
          candidates: filledCandidates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create election");
      }

      alert("Election created successfully!");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-candidate-container">
      <div className="form-card">
        <h2 className="form-title">Create New Election</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Election Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter election name"
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <select
              name="city_id"
              value={formData.city_id}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Barangay (Optional)</label>
            <select
              name="baranggay_id"
              value={formData.baranggay_id}
              onChange={handleChange}
              disabled={!formData.city_id || loading}
            >
              <option value="">Select Barangay</option>
              {barangays.map((brgy) => (
                <option key={brgy._id} value={brgy._id}>
                  {brgy.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter election description"
            />
          </div>

          <div className="date-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="candidates-section">
            <h3>Candidates</h3>
            {formData.candidates.map((candidate, index) => (
              <div key={index} className="candidate-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={candidate.name}
                    onChange={(e) => handleCandidateChange(index, e)}
                    placeholder="Candidate name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="party"
                    value={candidate.party}
                    onChange={(e) => handleCandidateChange(index, e)}
                    placeholder="Party affiliation"
                    required
                  />
                </div>
                {formData.candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCandidate(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCandidate}
              className="add-candidate-btn"
            >
              + Add Candidate
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Creating..." : "Create Election"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCandidate;
