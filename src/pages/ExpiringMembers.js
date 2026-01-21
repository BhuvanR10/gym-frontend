import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ExpiringMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewingMember, setRenewingMember] = useState(null);
  const [newEndDate, setNewEndDate] = useState(null);
  const [renewalLoading, setRenewalLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchExpiring();
  }, []);

  const fetchExpiring = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/members/expiring/soon");
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to load expiring members:", err);
      setError("Failed to load expiring members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openRenewModal = (member) => {
    setRenewingMember(member);
    setNewEndDate(new Date(member.end_date)); // Pre-fill with current end date
    setShowRenewModal(true);
    setMessage({ type: "", text: "" }); // Clear previous messages
  };

  const closeRenewModal = () => {
    setShowRenewModal(false);
    setRenewingMember(null);
    setNewEndDate(null);
  };

  const handleRenew = async () => {
    if (!newEndDate || !renewingMember) return;

    setRenewalLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(`/members/${renewingMember.member_id}/renew`, {
        new_end_date: newEndDate.toISOString().slice(0, 10),
      });
      setMessage({ type: "success", text: `Membership for ${renewingMember.name} renewed successfully!` });
      // Remove the renewed member from the list
      setMembers(members.filter((m) => m.member_id !== renewingMember.member_id));
      closeRenewModal();
    } catch (err) {
      console.error("Renewal failed:", err);
      setMessage({ type: "danger", text: "Failed to renew membership. Please try again." });
    } finally {
      setRenewalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading expiring members...</span>
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
      </div>
    );
  }

  return (
    <div className="container mt-4 p-4">
      <h2 className="mb-4 text-primary fw-bold">⏰ Expiring Memberships</h2>

      {message.text && (
        <div className={`alert alert-${message.type} mb-4`} role="alert">
          {message.text}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>End Date</th>
              <th>Days Left</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No memberships expiring soon.
                  <br />
                  <Link to="/members" className="btn btn-sm btn-primary mt-3">
                    View All Members
                  </Link>
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.member_id} className={m.days_left <= 7 ? "table-warning" : ""}>
                  <td>{m.name}</td>
                  <td>{m.phone}</td>
                  <td>{new Date(m.end_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${m.days_left <= 7 ? "bg-danger" : "bg-warning"}`}>
                      {m.days_left} day{m.days_left !== 1 ? "s" : ""} left
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => openRenewModal(m)}
                    >
                      Renew
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Renewal Modal */}
      <div
        className={`modal fade ${showRenewModal ? "show" : ""}`}
        style={{ display: showRenewModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="renewModalLabel"
        aria-hidden={!showRenewModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="renewModalLabel">
                Renew Membership for {renewingMember?.name}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={closeRenewModal}
              ></button>
            </div>
            <div className="modal-body">
              {message.text && message.type !== "success" && (
                <div className={`alert alert-${message.type} mb-3`} role="alert">
                  {message.text}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="newEndDate" className="form-label">New End Date</label>
                <DatePicker
                  selected={newEndDate}
                  onChange={(date) => setNewEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  id="newEndDate"
                  required
                  minDate={renewingMember ? new Date(renewingMember.end_date) : new Date()} // Minimum date is current end date or today
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeRenewModal}
                disabled={renewalLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleRenew}
                disabled={renewalLoading || !newEndDate}
              >
                {renewalLoading && (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                )}
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      </div>
      {showRenewModal && <div className="modal-backdrop fade show"></div>} {/* Manual backdrop */}
    </div>
  );
}

export default ExpiringMembers;
