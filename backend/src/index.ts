import express from "express";
import cors from "cors";
import taskRoutes from "./routes/task.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
