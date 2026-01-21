import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom"; // Import Link for navigation

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
      setError("Failed to load dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
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
      <h2 className="mb-4 text-primary fw-bold">Dashboard Overview</h2>

      <div className="row g-4">
        {/* Total Members Card */}
        <div className="col-md-6 col-lg-3">
          <Link to="/members" className="card text-decoration-none h-100 shadow-sm border-0 animated-card">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title text-muted text-uppercase mb-2">Total Members</h5>
                <h2 className="card-text fw-bold text-dark">{stats.totalMembers}</h2>
              </div>
              <i className="bi bi-people-fill display-4 text-primary"></i>
            </div>
          </Link>
        </div>

        {/* Active Members Card */}
        <div className="col-md-6 col-lg-3">
          <Link to="/members" className="card text-decoration-none h-100 shadow-sm border-0 animated-card">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title text-muted text-uppercase mb-2">Active Members</h5>
                <h2 className="card-text fw-bold text-success">{stats.activeMembers}</h2>
              </div>
              <i className="bi bi-person-check-fill display-4 text-success"></i>
            </div>
          </Link>
        </div>

        {/* Expired Members Card */}
        <div className="col-md-6 col-lg-3">
          <Link to="/reports/expiring" className="card text-decoration-none h-100 shadow-sm border-0 animated-card">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title text-muted text-uppercase mb-2">Expired Members</h5>
                <h2 className="card-text fw-bold text-danger">{stats.expiredMembers}</h2>
              </div>
              <i className="bi bi-person-x-fill display-4 text-danger"></i>
            </div>
          </Link>
        </div>

        {/* Today's Attendance Card */}
        <div className="col-md-6 col-lg-3">
          <Link to="/attendance" className="card text-decoration-none h-100 shadow-sm border-0 animated-card">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title text-muted text-uppercase mb-2">Today's Attendance</h5>
                <h2 className="card-text fw-bold text-info">{stats.todayAttendance}</h2>
              </div>
              <i className="bi bi-calendar-check-fill display-4 text-info"></i>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
