import { useState } from "react";
import axios from "../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MonthlyReport() {
  const [selectedMonth, setSelectedMonth] = useState(new Date()); // Initialize with current date for month selection
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    if (!selectedMonth) {
      setError("Please select a month to generate the report.");
      return;
    }

    setLoading(true);
    setError("");
    setData([]); // Clear previous data

    try {
      const formattedMonth = selectedMonth.toISOString().slice(0, 7); // YYYY-MM format
      const res = await axios.get(`/attendance/monthly?month=${formattedMonth}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load monthly report:", err);
      setError("Failed to load monthly report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 p-4">
      <h2 className="mb-4 text-primary fw-bold">📅 Monthly Attendance Report</h2>

      <div className="d-flex align-items-center mb-4">
        <label className="form-label me-3 mb-0">Select Month:</label>
        <DatePicker
          selected={selectedMonth}
          onChange={(date) => setSelectedMonth(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="form-control"
          popperPlacement="bottom-start"
        />
        <button className="btn btn-primary ms-3" onClick={fetchReport} disabled={loading}>
          {loading && (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          )}
          Generate Report
        </button>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading report...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Total Days Attended</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No attendance data for the selected month.
                  </td>
                </tr>
              ) : (
                data.map((d) => (
                  <tr key={d.member_id}>
                    <td>{d.name}</td>
                    <td>{d.phone}</td>
                    <td>{d.total_days}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MonthlyReport;
