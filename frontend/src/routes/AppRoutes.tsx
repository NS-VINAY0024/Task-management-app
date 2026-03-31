import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskList from "../pages/TaskList";
import CreateTask from "../pages/CreateTask";
import TaskDetail from "../pages/TaskDetail";
import EditTask from "../pages/EditTask";

/**
 * ISSUES FIXED vs original:
 * 1. Stray `{" "}` JSX whitespace after /create route removed.
 * 2. Catch-all `*` route added → redirects unknown URLs to home.
 * 3. BrowserRouter is the correct location for this component (unchanged).
 */
const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TaskList />} />
      <Route path="/create" element={<CreateTask />} />
      <Route path="/task/:id" element={<TaskDetail />} />
      <Route path="/edit/:id" element={<EditTask />} />
      {/* Redirect any unknown path back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
