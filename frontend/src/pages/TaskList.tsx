import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
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

import { deleteTask, getApiErrorMessage, getTasks } from "../services/taskService";
import TaskCard from "../components/TaskCard";
import type { Task, TaskQueryParams, TaskStatus } from "../types/task";
import { TASK_STATUSES } from "../types/task";
import { useSnackbar } from "../context/SnackbarContext";

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

/**
 * ISSUES FIXED vs original:
 * 1. Filter (status) and sort controls added — uses API query params.
 * 2. Skeleton loading replaces full-page CircularProgress (better perceived perf).
 * 3. getStatusColor / getPriorityColor moved to StatusBadge component.
 * 4. Tasks rendered via <TaskCard> — list is now clean and DRY.
 * 5. Empty state with CTA when no tasks match the filter.
 * 6. `params` memoised so useEffect only re-fetches when filters actually change.
 * 7. `useCallback` on fetch to avoid recreating on every render.
 */
const TaskList = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter / sort state
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [sortBy, setSortBy] =
    useState<NonNullable<TaskQueryParams["sortBy"]>>("createdAt");

  // Build query params only when filter/sort values change.
  const params = useMemo<TaskQueryParams>(() => {
    const p: TaskQueryParams = { sortBy, order: "desc" };
    if (statusFilter !== "ALL") p.status = statusFilter;
    return p;
  }, [statusFilter, sortBy]);

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

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Container maxWidth="md" sx={{ pb: 6 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4" component="h1">
          My Tasks
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/create")}
        >
          New Task
        </Button>
      </Box>

      {/* Filter & Sort controls */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as TaskStatus | "ALL")
          }
          size="small"
          sx={{ minWidth: 140 }}
          aria-label="Filter by status"
        >
          {(["ALL", ...TASK_STATUSES] as const).map((s) => (
            <MenuItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as NonNullable<TaskQueryParams["sortBy"]>)
          }
          size="small"
          sx={{ minWidth: 140 }}
          aria-label="Sort tasks by"
        >
          {SORT_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Error state */}
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

      {/* Skeleton loading — 3 placeholder cards */}
      {loading && (
        <Stack spacing={2}>
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} variant="rounded" height={100} />
          ))}
        </Stack>
      )}

      {/* Empty state */}
      {!loading && !error && tasks.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={8}
          gap={2}
        >
          <Typography color="text.secondary" variant="h6">
            No tasks found.
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
        </Box>
      )}

      {/* Task cards */}
      {!loading && (
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
            Are you sure you want to permanently delete &ldquo;{taskToDelete?.title}
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
    </Container>
  );
};

export default TaskList;
