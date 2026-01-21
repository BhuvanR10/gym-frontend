import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddMember() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    biometric_id: "",
    plan_type: "Monthly",
    start_date: null, // Initialize with null for DatePicker
    end_date: null,   // Initialize with null for DatePicker
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Format dates to YYYY-MM-DD for the backend
    const dataToSend = {
      ...formData,
      start_date: formData.start_date ? formData.start_date.toISOString().slice(0, 10) : "",
      end_date: formData.end_date ? formData.end_date.toISOString().slice(0, 10) : "",
    };

    try {
      await axios.post("/members/add", dataToSend);
      setMessage({ type: "success", text: "Member added successfully!" });
      setFormData({
        name: "",
        phone: "",
        email: "",
        biometric_id: "",
        plan_type: "Monthly",
        start_date: null,
        end_date: null,
      });
      setTimeout(() => navigate("/members"), 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error("Failed to add member:", err);
      setMessage({ type: "danger", text: "Failed to add member. Please check details." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary fw-bold">➕ Add New Member</h2>

      <div className="card shadow-lg p-4">
        <div className="card-body">
          {message.text && (
            <div className={`alert alert-${message.type} mb-3`} role="alert">
              {message.text}
            </div>
          )}
          <form onSubmit={submitForm}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="name"
                  name="name"
                  placeholder="Enter member's name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email (Optional)</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="biometric_id" className="form-label">Biometric ID (Device PIN)</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-fingerprint"></i></span>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="biometric_id"
                  name="biometric_id"
                  placeholder="Enter biometric device PIN"
                  value={formData.biometric_id}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="plan_type" className="form-label">Membership Plan</label>
              <select
                className="form-select form-select-lg"
                id="plan_type"
                name="plan_type"
                value={formData.plan_type}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="start_date" className="form-label">Start Date</label>
              <DatePicker
                selected={formData.start_date}
                onChange={(date) => handleDateChange(date, "start_date")}
                dateFormat="yyyy-MM-dd"
                className="form-control form-control-lg"
                id="start_date"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="end_date" className="form-label">End Date</label>
              <DatePicker
                selected={formData.end_date}
                onChange={(date) => handleDateChange(date, "end_date")}
                dateFormat="yyyy-MM-dd"
                className="form-control form-control-lg"
                id="end_date"
                required
                disabled={loading}
              />
            </div>

            <button
              className="btn btn-success btn-lg w-100 d-flex justify-content-center align-items-center"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              )}
              Add Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMember;
