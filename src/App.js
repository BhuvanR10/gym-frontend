import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Attendance from "./pages/Attendance";
import MonthlyReport from "./pages/MonthlyReport";
import ExpiringMembers from "./pages/ExpiringMembers";
import MemberDetail from "./pages/MemberDetail"; // Import the new MemberDetail component


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/members"
          element={
            <PrivateRoute>
              <Members />
            </PrivateRoute>
          }
        />

        {/* New Route for Member Detail Page */}
        <Route
          path="/members/:id"
          element={
            <PrivateRoute>
              <MemberDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-member"
          element={
            <PrivateRoute>
              <AddMember />
            </PrivateRoute>
          }
        />

        <Route
        path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />
        <Route
        path="/reports/monthly"
        element={
          <PrivateRoute>
            <MonthlyReport />
          </PrivateRoute>
        }
        />
        <Route
          path="/reports/expiring"
          element={
            <PrivateRoute>
              <ExpiringMembers />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
