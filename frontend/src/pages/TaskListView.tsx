import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import { useSnackbar } from "../context/SnackbarContext";
import TaskCard from "../components/TaskCard";
import {
  deleteTask,
  getApiErrorMessage,
  getTasks,
} from "../services/taskService";
import { TASK_STATUSES } from "../types/task";
import type { Task, TaskQueryParams, TaskStatus } from "../types/task";

const STATUS_LABELS: Record<TaskStatus | "ALL", string> = {
  ALL: "All",
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const SORT_OPTIONS: { value: TaskQueryParams["sortBy"]; label: string }[] = [
  { value: "createdAt", label: "Created Date" },
  { value: "dueDate", label: "Due Date" },
];

const TaskListView = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [sortBy, setSortBy] =
    useState<NonNullable<TaskQueryParams["sortBy"]>>("createdAt");

  const params = useMemo<TaskQueryParams>(() => {
    const nextParams: TaskQueryParams = { sortBy, order: "desc" };
    if (statusFilter !== "ALL") nextParams.status = statusFilter;
    return nextParams;
  }, [sortBy, statusFilter]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTasks(params);
      setTasks(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!taskToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete.id));
      showSnackbar("Task deleted successfully.", "success");
      setTaskToDelete(null);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      showSnackbar(message, "error");
    } finally {
      setIsDeleting(false);
    }
  }, [showSnackbar, taskToDelete]);

  const summary = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "TODO").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      done: tasks.filter((task) => task.status === "DONE").length,
    }),
    [tasks],
  );

  return (
    <Box sx={{ pb: 4 }}>
      <Card
        sx={{
          mb: 3,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(31,111,120,0.96) 0%, rgba(22,76,83,0.94) 55%, rgba(217,119,87,0.9) 100%)",
          color: "primary.contrastText",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Box>
                <Typography variant="h2" component="h1" gutterBottom>
                  Make every task feel easy to act on.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ maxWidth: 640, opacity: 0.92 }}
                >
                  Review priorities, clean up what is in motion, and keep your
                  next step visible without the interface getting in your way.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/create")}
                sx={{
                  minWidth: 170,
                  backgroundColor: "rgba(255,255,255,0.14)",
                  color: "primary.contrastText",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.18)",
                  },
                }}
              >
                Create Task
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
        {[
          {
            label: "Total tasks",
            value: summary.total,
            hint: "Everything currently in your workspace",
            icon: (
              <AssignmentTurnedInRoundedIcon sx={{ color: "primary.main" }} />
            ),
          },
          {
            label: "To do",
            value: summary.todo,
            hint: "Tasks waiting to be started",
            icon: <PendingActionsRoundedIcon sx={{ color: "#d3933b" }} />,
          },
          {
            label: "In progress",
            value: summary.inProgress,
            hint: "Work that is already moving",
            icon: <TimelineRoundedIcon sx={{ color: "#1f6f78" }} />,
          },
        ].map((item) => (
          <Card key={item.label} sx={{ flex: 1 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "rgba(255,255,255,0.7)",
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h5">{item.value}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.hint}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">Refine your view</Typography>
              <Typography variant="body2" color="text.secondary">
                Filter the workspace and sort the list to focus on what matters
                next.
              </Typography>
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              useFlexGap
            >
              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as TaskStatus | "ALL")
                }
                size="small"
                sx={{ minWidth: 180 }}
                aria-label="Filter by status"
              >
                {(["ALL", ...TASK_STATUSES] as const).map((status) => (
                  <MenuItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Sort By"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as NonNullable<TaskQueryParams["sortBy"]>,
                  )
                }
                size="small"
                sx={{ minWidth: 180 }}
                aria-label="Sort tasks by"
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void fetchTasks()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {loading && (
        <Stack spacing={2}>
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} variant="rounded" height={138} />
          ))}
        </Stack>
      )}

      {!loading && !error && tasks.length === 0 && (
        <Card>
          <CardContent
            sx={{
              py: 7,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary" variant="h5">
              No tasks match this view.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
              Clear the filter or add a new task to bring this workspace back to
              life.
            </Typography>
            {statusFilter !== "ALL" && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setStatusFilter("ALL")}
              >
                Clear filter
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/create")}
            >
              Create your first task
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && tasks.length > 0 && (
        <Stack spacing={2}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={setTaskToDelete}
              deleting={isDeleting && taskToDelete?.id === task.id}
            />
          ))}
        </Stack>
      )}

      <Dialog
        open={Boolean(taskToDelete)}
        onClose={() => {
          if (!isDeleting) setTaskToDelete(null);
        }}
        aria-labelledby="delete-task-dialog-title"
      >
        <DialogTitle id="delete-task-dialog-title">Delete Task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete &ldquo;
            {taskToDelete?.title}
            &rdquo;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskToDelete(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => void handleDeleteConfirm()}
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskListView;
