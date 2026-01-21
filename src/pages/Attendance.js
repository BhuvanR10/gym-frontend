import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().slice(0, 10);
      const res = await axios.get(`/attendance?date=${formattedDate}`);
      setRecords(res.data);
    } catch (error) {
      console.error("Failed to load attendance:", error);
      alert("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <div className="container mt-4 p-4 shadow-sm rounded bg-white">
      <h3 className="mb-4 text-primary">Daily Attendance</h3>

      <div className="mb-4 d-flex align-items-center">
        <label className="form-label me-3 mb-0">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="form-control"
        />
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No attendance records for this date.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.attendance_id}>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{r.date}</td>
                    <td>{r.time}</td>
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

export default Attendance;
