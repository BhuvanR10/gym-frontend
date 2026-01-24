import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [renewing, setRenewing] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");

  // 🔹 IMPORTANT: separate input vs applied search
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [planTypeFilter, setPlanTypeFilter] = useState("");
  const [error, setError] = useState("");

  /* ================= FETCH MEMBERS ================= */
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (planTypeFilter) params.append("plan_type", planTypeFilter);

      const res = await axios.get(`/members?${params.toString()}`, {
        
      });

      if (Array.isArray(res.data)) {
        setMembers(res.data);
      } else {
        console.error("Invalid members response:", res.data);
        setMembers([]);
      }

    } catch (err) {
      console.error("FETCH MEMBERS ERROR:", err);
      setError("Failed to load members. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, planTypeFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  /* ================= EDIT MEMBER ================= */
  const openEdit = (member) => {
    setEditing({
      ...member,
      start_date: member.start_date?.slice(0, 10),
      end_date: member.end_date?.slice(0, 10),
      email: member.email || "",
    });
  };

  const updateMember = async () => {
    try {
      await axios.put(`/members/update/${editing.member_id}`, {
        name: editing.name,
        phone: editing.phone,
        email: editing.email,
        plan_type: editing.plan_type,
        start_date: editing.start_date,
        end_date: editing.end_date,
      });

      alert("Member updated successfully");
      setEditing(null);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ================= DELETE MEMBER ================= */
  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await axios.delete(`/members/${id}`);
      fetchMembers();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= RENEW MEMBER ================= */
  const openRenew = (member) => {
    setRenewing(member);
    setNewEndDate(member.end_date.slice(0, 10));
  };

  const renewMember = async () => {
    if (!newEndDate) return alert("Select new end date");

    try {
      await axios.post(`/members/${renewing.member_id}/renew`, {
        new_end_date: newEndDate,
      });
      alert("Membership renewed");
      setRenewing(null);
      fetchMembers();
    } catch {
      alert("Renewal failed");
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-primary fw-bold mb-3">👥 Members List</h2>

      {/* ===== FILTERS ===== */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Search by name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={planTypeFilter}
            onChange={(e) => setPlanTypeFilter(e.target.value)}
          >
            <option value="">All Plans</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={() => setSearch(searchInput)}
          >
            Apply
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Plan</th>
              <th>End Date</th>
              <th>Status</th>
              <th width="300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No members found
                </td>
              </tr>
            )}

            {Array.isArray(members) && members.map((m) => (
              <tr key={m.member_id}>
                <td>{m.name}</td>
                <td>{m.phone}</td>
                <td>{m.email || "-"}</td>
                <td>{m.plan_type}</td>
                <td>{m.end_date?.slice(0, 10)}</td>
                <td>
                  <span
                    className={`badge ${
                      m.status === "Active" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => openEdit(m)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-info me-1"
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
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editing && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Edit Member</h5>

              <input
                className="form-control mb-2"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
              <input
                className="form-control mb-2"
                value={editing.phone}
                onChange={(e) =>
                  setEditing({ ...editing, phone: e.target.value })
                }
              />
              <input
                className="form-control mb-2"
                value={editing.email}
                onChange={(e) =>
                  setEditing({ ...editing, email: e.target.value })
                }
              />
              <input
                type="date"
                className="form-control mb-2"
                value={editing.start_date}
                onChange={(e) =>
                  setEditing({ ...editing, start_date: e.target.value })
                }
              />
              <input
                type="date"
                className="form-control mb-2"
                value={editing.end_date}
                onChange={(e) =>
                  setEditing({ ...editing, end_date: e.target.value })
                }
              />

              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={updateMember}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== RENEW MODAL ===== */}
      {renewing && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Renew Membership</h5>

              <input
                type="date"
                className="form-control mb-3"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />

              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setRenewing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={renewMember}>
                  Renew
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
