import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) return null;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Refined active link styling
  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "nav-link active" // Bootstrap active class
      : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3">
      <div className="container-fluid">
        <Link to="/dashboard" className="navbar-brand fw-bold fs-4 text-primary">
          🏋️ Gym Admin
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav gap-2">
            <li className="nav-item">
              <Link to="/dashboard" className={isActive("/dashboard")}>
                📊 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/members" className={isActive("/members")}>
                👥 Members
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/add-member" className={isActive("/add-member")}>
                ➕ Add Member
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/attendance" className={isActive("/attendance")}>
                🕒 Attendance
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reports/monthly" className={isActive("/reports/monthly")}>
                📅 Monthly Report
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/reports/expiring" className={isActive("/reports/expiring")}>
                ⏰ Expiring
              </Link>
            </li>
            <li className="nav-item">
              <button
                onClick={logout}
                className="btn btn-outline-danger ms-lg-3 mt-2 mt-lg-0"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
