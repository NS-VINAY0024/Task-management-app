import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useSnackbar } from "../context/SnackbarContext";
import TaskCard from "../components/TaskCard";
import {
  deleteTask,
  getApiErrorMessage,
  getTasks,
} from "../services/taskService";
import {
  ORDER_OPTIONS,
  PAGE_SIZE_OPTIONS,
  SORT_BY_OPTIONS,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
} from "../types/task";
import type {
  PaginationMeta,
  Task,
  TaskOrder,
  TaskPriority,
  TaskQueryParams,
  TaskSortBy,
  TaskStatus,
} from "../types/task";
import { isOverdueDate } from "../utils/formatDate";

const SORT_LABELS: Record<TaskSortBy, string> = {
  createdAt: "Created date",
  dueDate: "Due date",
};

const ORDER_LABELS: Record<TaskOrder, string> = {
  asc: "Ascending",
  desc: "Descending",
};

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const clearAllFilters = (
  setSearchInput: (value: string) => void,
  setSearchParams: (
    nextInit: URLSearchParams,
    navigateOptions?: { replace?: boolean },
  ) => void,
) => {
  setSearchInput("");
  setSearchParams(new URLSearchParams(), { replace: true });
};

const TaskListView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const filters = useMemo(() => {
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");

    return {
      search: searchParams.get("search") ?? "",
      status: (searchParams.get("status") as TaskStatus | null) ?? "ALL",
      priority: (searchParams.get("priority") as TaskPriority | null) ?? "ALL",
      sortBy: (searchParams.get("sortBy") as TaskSortBy | null) ?? "createdAt",
      order: (searchParams.get("order") as TaskOrder | null) ?? "desc",
      page: Number.isNaN(page) || page < 1 ? 1 : page,
      pageSize: PAGE_SIZE_OPTIONS.includes(pageSize as 5 | 10 | 20)
        ? (pageSize as 5 | 10 | 20)
        : 10,
    };
  }, [searchParams]);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const updateFilters = useCallback(
    (updates: Record<string, string | number | null>) => {
      const nextParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "ALL") {
          nextParams.delete(key);
          return;
        }

        nextParams.set(key, String(value));
      });

      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedInput = searchInput.trim();

      if (normalizedInput === filters.search) {
        return;
      }

      updateFilters({ search: normalizedInput || null, page: 1 });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [filters.search, searchInput, updateFilters]);

  const params = useMemo<TaskQueryParams>(() => {
    const nextParams: TaskQueryParams = {
      sortBy: filters.sortBy,
      order: filters.order,
      page: filters.page,
      pageSize: filters.pageSize,
    };

    if (filters.search) nextParams.search = filters.search;
    if (filters.status !== "ALL")
      nextParams.status = filters.status as TaskStatus;
    if (filters.priority !== "ALL") {
      nextParams.priority = filters.priority as TaskPriority;
    }

    return nextParams;
  }, [filters]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTasks(params);
      setTasks(response.data);
      setMeta(response.meta);

      if (
        response.meta.total > 0 &&
        filters.page > response.meta.totalPages &&
        response.meta.totalPages >= 1
      ) {
        updateFilters({ page: response.meta.totalPages });
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters.page, params, updateFilters]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!taskToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteTask(taskToDelete.id);
      showSnackbar("Task deleted successfully.", "success");
      setTaskToDelete(null);
      await fetchTasks();
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      showSnackbar(message, "error");
    } finally {
      setIsDeleting(false);
    }
  }, [fetchTasks, showSnackbar, taskToDelete]);

  const summary = useMemo(
    () =>
      tasks.reduce(
        (result, task) => {
          result.visible += 1;

          if (task.status === "DONE") {
            result.completed += 1;
          } else if (isOverdueDate(task.dueDate)) {
            result.overdue += 1;
          }

          return result;
        },
        {
          total: meta.total,
          visible: 0,
          completed: 0,
          overdue: 0,
        },
      ),
    [meta.total, tasks],
  );

  const hasActiveFilters = Boolean(
    filters.search || filters.status !== "ALL" || filters.priority !== "ALL",
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
                  Search, filter, and page through the workspace without losing
                  your place or your context.
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
            label: "Total results",
            value: summary.total,
            hint: "Tasks matching the current view",
            icon: (
              <AssignmentTurnedInRoundedIcon sx={{ color: "primary.main" }} />
            ),
          },
          {
            label: "Visible now",
            value: summary.visible,
            hint: `Showing page ${meta.page} of ${meta.totalPages}`,
            icon: <SearchRoundedIcon sx={{ color: "#1f6f78" }} />,
          },
          {
            label: "Overdue on this page",
            value: summary.overdue,
            hint: `${summary.completed} completed tasks in view`,
            icon: <WarningAmberRoundedIcon sx={{ color: "#c85f51" }} />,
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
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6">Refine your view</Typography>
              <Typography variant="body2" color="text.secondary">
                Shareable URL filters keep the task list stable across refreshes
                and direct links.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", lg: "row" }}
              flexWrap="wrap"
              spacing={2}
              useFlexGap
            >
              <TextField
                label="Search"
                placeholder="Search title or description"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                size="small"
                sx={{ minWidth: { xs: "100%", lg: 280 } }}
              />

              <TextField
                select
                label="Status"
                value={filters.status}
                onChange={(event) =>
                  updateFilters({ status: event.target.value, page: 1 })
                }
                size="small"
                sx={{ minWidth: 160 }}
              >
                {(["ALL", ...TASK_STATUSES] as const).map((status) => (
                  <MenuItem key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Priority"
                value={filters.priority}
                onChange={(event) =>
                  updateFilters({ priority: event.target.value, page: 1 })
                }
                size="small"
                sx={{ minWidth: 170 }}
              >
                {(["ALL", ...TASK_PRIORITIES] as const).map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {TASK_PRIORITY_LABELS[priority]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Sort by"
                value={filters.sortBy}
                onChange={(event) =>
                  updateFilters({ sortBy: event.target.value, page: 1 })
                }
                size="small"
                sx={{ minWidth: 170 }}
              >
                {SORT_BY_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {SORT_LABELS[option]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Order"
                value={filters.order}
                onChange={(event) =>
                  updateFilters({ order: event.target.value, page: 1 })
                }
                size="small"
                sx={{ minWidth: 160 }}
              >
                {ORDER_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {ORDER_LABELS[option]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Page size"
                value={filters.pageSize}
                onChange={(event) =>
                  updateFilters({
                    pageSize: Number(event.target.value),
                    page: 1,
                  })
                }
                size="small"
                sx={{ minWidth: 140 }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option} per page
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                {meta.total === 0
                  ? "No results in this view yet."
                  : `Showing ${tasks.length} of ${meta.total} matching tasks.`}
              </Typography>
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => clearAllFilters(setSearchInput, setSearchParams)}
                >
                  Clear all filters
                </Button>
              )}
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
              Try widening the search, clearing a filter, or adding a new task
              to bring this workspace back to life.
            </Typography>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => clearAllFilters(setSearchInput, setSearchParams)}
              >
                Clear filters
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

      {!loading && !error && meta.totalPages > 1 && (
        <Stack alignItems="center" mt={4}>
          <Pagination
            color="primary"
            page={meta.page}
            count={meta.totalPages}
            onChange={(_event, value) => updateFilters({ page: value })}
          />
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
