import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  deleteTask,
  getApiErrorMessage,
  getTaskById,
} from "../services/taskService";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { formatDate } from "../utils/formatDate";
import { useSnackbar } from "../context/SnackbarContext";
import type { Task } from "../types/task";

/**
 * ISSUES FIXED vs original:
 * 1. Raw `task.status` / `task.priority` strings replaced with StatusBadge / PriorityBadge.
 * 2. Date displayed via `formatDate` utility (consistent locale formatting).
 * 3. Delete confirmation dialog added — prevents accidental deletion.
 * 4. Snackbar on delete success/error instead of silent redirect.
 * 5. `id` typed as `string | undefined` via generic useParams; guard present.
 * 6. Cleanup flag prevents setState after unmount.
 * 7. MUI icon imports make buttons visually clearer.
 * 8. Back button for better navigation flow.
 */
const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ─── Load task ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) {
      setError("Task ID is missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchTask = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getTaskById(id);
        if (!cancelled) setTask(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchTask();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    if (!id) return;

    setIsDeleting(true);
    setConfirmOpen(false);

    try {
      await deleteTask(id);
      showSnackbar("Task deleted.", "success");
      navigate("/");
    } catch (err) {
      setError(getApiErrorMessage(err));
      showSnackbar(getApiErrorMessage(err), "error");
      setIsDeleting(false);
    }
  }, [id, navigate, showSnackbar]);

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Container>
        <Stack alignItems="center" mt={8} spacing={2}>
          <CircularProgress aria-label="Loading task" />
          <Typography color="text.secondary">Loading task…</Typography>
        </Stack>
      </Container>
    );
  }

  if (error && !task) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Back to Tasks
        </Button>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container>
        <Typography mt={4} color="text.secondary">
          Task not found.
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Back to Tasks
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      {/* Back navigation */}
      <Box mt={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          size="small"
        >
          All Tasks
        </Button>
      </Box>

      {/* API error (e.g. delete failure) shown inline without losing content */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Title & badges */}
      <Box mt={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          {task.title}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <StatusBadge status={task.status} size="medium" />
          <PriorityBadge priority={task.priority} size="medium" />
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Detail rows */}
      <Stack spacing={1.5}>
        {task.description && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">{task.description}</Typography>
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Due Date
          </Typography>
          <Typography variant="body1">{formatDate(task.dueDate)}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Created
          </Typography>
          <Typography variant="body1">{formatDate(task.createdAt)}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Last Updated
          </Typography>
          <Typography variant="body1">{formatDate(task.updatedAt)}</Typography>
        </Box>
      </Stack>

      {/* Action buttons */}
      <Stack direction="row" spacing={2} mt={4}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/edit/${task.id}`)}
        >
          Edit
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setConfirmOpen(true)}
          disabled={isDeleting}
          aria-busy={isDeleting}
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </Button>
      </Stack>

      {/* Delete confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete &ldquo;{task.title}
            &rdquo;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => void handleDeleteConfirm()}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskDetail;
