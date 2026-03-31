import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/AppShell";
import TaskListView from "../pages/TaskListView";
import CreateTask from "../pages/CreateTask";
import TaskDetailView from "../pages/TaskDetailView";
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
      <Route element={<AppShell />}>
        <Route path="/" element={<TaskListView />} />
        <Route path="/create" element={<CreateTask />} />
        <Route path="/task/:id" element={<TaskDetailView />} />
        <Route path="/edit/:id" element={<EditTask />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
