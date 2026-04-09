import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "../components/AppShell";
import AuthLayout from "../components/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicOnlyRoute from "../components/PublicOnlyRoute";
import CreateTask from "../pages/CreateTask";
import EditTask from "../pages/EditTask";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import TaskDetailView from "../pages/TaskDetailView";
import TaskListView from "../pages/TaskListView";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<TaskListView />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/task/:id" element={<TaskDetailView />} />
          <Route path="/edit/:id" element={<EditTask />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
