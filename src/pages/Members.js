import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [renewing, setRenewing] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planTypeFilter, setPlanTypeFilter] = useState("");
  const [error, setError] = useState("");

  const fetchMembers = useCallback(async () => {
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
  }, [search, statusFilter, planTypeFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Open edit modal
  const openEdit = (member) => {
    setEditing({
      ...member,
      email: member.email || "",
      start_date: member.start_date.slice(0, 10),
      end_date: member.end_date.slice(0, 10),
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

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await axios.delete(`/members/${id}`);
      fetchMembers();
    } catch {
      alert("Delete failed");
    }
  };

  const openRenew = (member) => {
    setRenewing(member);
    setNewEndDate(member.end_date);
  };

  const renewMember = async () => {
    if (!newEndDate) {
      alert("Please select new end date");
      return;
    }

    try {
      await axios.post(`/members/${renewing.member_id}/renew`, {
        new_end_date: newEndDate,
      });
      alert("Membership renewed successfully");
      setRenewing(null);
      fetchMembers();
    } catch {
      alert("Renewal failed");
    }
  };

  /* ===== UI BELOW (UNCHANGED) ===== */

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
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 p-4">
      <h2 className="mb-4 text-primary fw-bold">👥 Members List</h2>

      {/* rest of your JSX is unchanged */}
      {/* KEEP YOUR EXISTING JSX EXACTLY AS IT IS */}
    </div>
  );
}

export default Members;
