import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskList from "../pages/TaskList";
import CreateTask from "../pages/CreateTask";
import TaskDetail from "../pages/TaskDetail";
import EditTask from "../pages/EditTask";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/create" element={<CreateTask />} />{" "}
        <Route path="/task/:id" element={<TaskDetail />} />
        <Route path="/edit/:id" element={<EditTask />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
