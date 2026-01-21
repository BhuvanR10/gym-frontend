import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axios";
import "react-datepicker/dist/react-datepicker.css";

function MemberDetail() {
  const { id } = useParams();
  const [memberDetails, setMemberDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMemberDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/members/${id}/details`);
      setMemberDetails(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch member details:", err);
      setError("Failed to load member details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMemberDetails();
  }, [fetchMemberDetails]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading member details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/members" className="btn btn-primary mt-3">
          Back to Members List
        </Link>
      </div>
    );
  }

  if (!memberDetails || !memberDetails.member) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-muted">Member not found.</h2>
        <Link to="/members" className="btn btn-primary mt-3">
          Back to Members List
        </Link>
      </div>
    );
  }

  const { member, membershipHistory, attendanceHistory } = memberDetails;

  return (
    <div className="container mt-4 p-4">
      <h2 className="mb-4 text-primary fw-bold">
        👤 {member.name}{" "}
        <small className="text-muted">({member.member_id})</small>
      </h2>

      <div className="row g-4">
        {/* Member Info */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              Member Info
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {member.name}</p>
              <p><strong>Phone:</strong> {member.phone}</p>
              <p><strong>Email:</strong> {member.email || "N/A"}</p>
              <p><strong>Current Plan:</strong> {member.plan_type}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge bg-${
                    member.status === "Active" ? "success" : "danger"
                  }`}
                >
                  {member.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Membership History */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              Membership History
            </div>
            <div className="card-body">
              {membershipHistory.length === 0 ? (
                <p className="text-muted">No membership history available.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {membershipHistory.map((plan, index) => (
                    <li key={index} className="list-group-item">
                      <strong>Plan:</strong> {plan.plan_type}<br />
                      <strong>Start:</strong>{" "}
                      {new Date(plan.start_date).toLocaleDateString()}<br />
                      <strong>End:</strong>{" "}
                      {new Date(plan.end_date).toLocaleDateString()}<br />
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge bg-${
                          plan.status === "Active" ? "success" : "danger"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="col-12 mt-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              Attendance Log
            </div>
            <div className="card-body">
              {attendanceHistory.length === 0 ? (
                <p className="text-muted">No attendance records available.</p>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <ul className="list-group">
                    {attendanceHistory.map((record, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between"
                      >
                        <span>
                          {new Date(record.check_time).toLocaleDateString()}
                        </span>
                        <span className="badge bg-info text-dark">
                          {new Date(record.check_time).toLocaleTimeString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/members" className="btn btn-secondary">
          ← Back to Members List
        </Link>
      </div>
    </div>
  );
}

export default MemberDetail;
