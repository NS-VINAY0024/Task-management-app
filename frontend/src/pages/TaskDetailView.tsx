import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import {
  deleteTask,
  getApiErrorMessage,
  getTaskById,
} from "../services/taskService";
import { useSnackbar } from "../context/SnackbarContext";
import { formatDate } from "../utils/formatDate";
import { PriorityBadge, StatusBadge } from "../components/StatusBadge";
import type { Task } from "../types/task";

const TaskDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const handleDeleteConfirm = useCallback(async () => {
    if (!id) return;

    setIsDeleting(true);
    setConfirmOpen(false);

    try {
      await deleteTask(id);
      showSnackbar("Task deleted.", "success");
      navigate("/");
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      showSnackbar(message, "error");
      setIsDeleting(false);
    }
  }, [id, navigate, showSnackbar]);

  if (loading) {
    return (
      <Stack alignItems="center" mt={8} spacing={2}>
        <CircularProgress aria-label="Loading task" />
        <Typography color="text.secondary">Loading task...</Typography>
      </Stack>
    );
  }

  if (error && !task) {
    return (
      <Box sx={{ maxWidth: 920, mx: "auto" }}>
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
      </Box>
    );
  }

  if (!task) {
    return (
      <Box sx={{ maxWidth: 920, mx: "auto" }}>
        <Typography mt={4} color="text.secondary">
          Task not found.
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Back to Tasks
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 980, mx: "auto" }}>
      <Box mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          size="small"
        >
          All Tasks
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={2.5}>
            <Chip
              icon={<UpdateRoundedIcon />}
              label="Task overview"
              sx={{ alignSelf: "flex-start" }}
            />
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {task.description?.trim() ||
                  "No description has been added for this task yet."}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <StatusBadge status={task.status} size="medium" />
              <PriorityBadge priority={task.priority} size="medium" />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Notes
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {task.description?.trim() ||
                "Use this space to add context, blockers, or next steps when you revisit the task later."}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: { xs: "100%", md: 320 }, flexShrink: 0 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Timeline
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <CalendarTodayRoundedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Due date
                  </Typography>
                </Stack>
                <Typography variant="body1">
                  {task.dueDate ? formatDate(task.dueDate) : "No due date set"}
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Created
                </Typography>
                <Typography variant="body1">{formatDate(task.createdAt)}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Last updated
                </Typography>
                <Typography variant="body1">{formatDate(task.updatedAt)}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete &ldquo;{task.title}&rdquo;?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={() => void handleDeleteConfirm()} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetailView;
