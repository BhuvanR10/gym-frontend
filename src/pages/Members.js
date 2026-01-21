import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom"; // Import Link for navigation

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [renewing, setRenewing] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // New state for status filter
  const [planTypeFilter, setPlanTypeFilter] = useState(""); // New state for plan type filter
  const [error, setError] = useState(""); // Add error state

  useEffect(() => {
    fetchMembers();
  }, [search, statusFilter, planTypeFilter]); // Re-fetch when filters change

  // Fetch members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (statusFilter) queryParams.append("status", statusFilter);
      if (planTypeFilter) queryParams.append("plan_type", planTypeFilter);

      const res = await axios.get(`/members?${queryParams.toString()}`);
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to load members:", err);
      setError("Failed to load members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEdit = (member) => {
    setEditing({
      ...member,
      email: member.email || "", // ✅ ensure email exists
      start_date: member.start_date.slice(0, 10),
      end_date: member.end_date.slice(0, 10),
    });
  };

  // Update member
  const updateMember = async () => {
    try {
      await axios.put(`/members/update/${editing.member_id}`, {
        name: editing.name,
        phone: editing.phone,
        email: editing.email, // ✅ CORRECT KEY
        plan_type: editing.plan_type,
        start_date: editing.start_date,
        end_date: editing.end_date,
      });

      alert("Member updated successfully"); // Consider using a better UI for feedback
      setEditing(null);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Update failed"); // Consider using a better UI for feedback
    }
  };

  // Delete member
  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await axios.delete(`/members/${id}`);
      fetchMembers();
    } catch {
      alert("Delete failed"); // Consider using a better UI for feedback
    }
  };

  // Renew modal
  const openRenew = (member) => {
    setRenewing(member);
    setNewEndDate(member.end_date); // Pre-fill with existing end date
  };

  const renewMember = async () => {
    if (!newEndDate) {
      alert("Please select new end date"); // Consider using a better UI for feedback
      return;
    }

    try {
      await axios.post(`/members/${renewing.member_id}/renew`, {
        new_end_date: newEndDate,
      });
      alert("Membership renewed successfully"); // Consider using a better UI for feedback
      setRenewing(null);
      fetchMembers();
    } catch {
      alert("Renewal failed"); // Consider using a better UI for feedback
    }
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading members...</span>
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
      <h2 className="mb-4 text-primary fw-bold">👥 Members List</h2>

      <div className="row mb-4 g-3">
        <div className="col-md-5 flex-grow-1"> {/* Added flex-grow-1 here */}
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ caretColor: 'black', color: 'black', backgroundColor: 'white' }} // Explicit styling for visibility
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select form-select-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select form-select-lg"
            value={planTypeFilter}
            onChange={(e) => setPlanTypeFilter(e.target.value)}
          >
            <option value="">All Plans</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Plan</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No members found matching your criteria.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.member_id}>
                  <td>{m.member_id}</td>
                  <td>
                    <Link to={`/members/${m.member_id}`} className="text-decoration-none text-primary fw-bold">
                      {m.name}
                    </Link>
                  </td>
                  <td>{m.phone}</td>
                  <td>{m.email || 'N/A'}</td>
                  <td>{m.plan_type}</td>
                  <td>{new Date(m.end_date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={
                        m.status === "Active"
                          ? "badge bg-success"
                          : "badge bg-danger"
                      }
                    >
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => openEdit(m)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openRenew(m)}
                    >
                      Renew
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteMember(m.member_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="modal show d-block" style={{ background: "#00000099" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title">Edit Member</h5>
                <button type="button" className="btn-close" onClick={() => setEditing(null)}></button>
              </div>
              <div className="modal-body pt-0">
                <div className="mb-3">
                  <label htmlFor="editName" className="form-label">Name</label>
                  <input
                    className="form-control"
                    id="editName"
                    placeholder="Name"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="editPhone" className="form-label">Phone</label>
                  <input
                    className="form-control"
                    id="editPhone"
                    placeholder="Phone"
                    value={editing.phone}
                    onChange={(e) =>
                      setEditing({ ...editing, phone: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="editEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="editEmail"
                    placeholder="Email"
                    value={editing.email}
                    onChange={(e) =>
                      setEditing({ ...editing, email: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="editPlanType" className="form-label">Plan Type</label>
                  <select
                    className="form-control"
                    id="editPlanType"
                    value={editing.plan_type}
                    onChange={(e) =>
                      setEditing({ ...editing, plan_type: e.target.value })
                    }
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="editStartDate" className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="editStartDate"
                    value={editing.start_date}
                    onChange={(e) =>
                      setEditing({ ...editing, start_date: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="editEndDate" className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="editEndDate"
                    value={editing.end_date}
                    onChange={(e) =>
                      setEditing({ ...editing, end_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={updateMember}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENEW MODAL */}
      {renewing && (
        <div className="modal show d-block" style={{ background: "#00000099" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title">Renew Membership for {renewing.name}</h5>
                <button type="button" className="btn-close" onClick={() => setRenewing(null)}></button>
              </div>
              <div className="modal-body pt-0">
                <div className="mb-3">
                  <label htmlFor="renewEndDate" className="form-label">New End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="renewEndDate"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setRenewing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={renewMember}>
                  Renew Membership
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Members;
