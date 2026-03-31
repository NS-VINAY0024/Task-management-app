import type { ChangeEvent } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { TASK_STATUSES, TASK_PRIORITIES } from "../types/task";
import type { TaskFormValues, TaskFormErrors } from "../types/task";

const STATUS_LABELS: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};
const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

interface TaskFormProps {
  formData: TaskFormValues;
  errors: TaskFormErrors; // per-field inline validation errors
  apiError: string | null; // error returned from the API
  submitting: boolean;
  submitLabel: string; // "Create Task" | "Update Task"
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const TaskForm = ({
  formData,
  errors,
  apiError,
  submitting,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  return (
    <Stack spacing={2.5}>
      {/* API-level error (e.g. network failure or 500) */}
      {apiError && (
        <Alert severity="error" role="alert">
          {apiError}
        </Alert>
      )}

      {/* Title */}
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={onChange}
        fullWidth
        required
        inputProps={{ maxLength: 200, "aria-required": "true" }}
        error={Boolean(errors.title)}
        helperText={errors.title ?? `${formData.title.length}/200`}
      />

      {/* Description */}
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={onChange}
        multiline
        rows={3}
        fullWidth
        inputProps={{ maxLength: 2000 }}
        error={Boolean(errors.description)}
        helperText={errors.description ?? `${formData.description.length}/2000`}
      />

      {/* Status */}
      <TextField
        select
        label="Status"
        name="status"
        value={formData.status}
        onChange={onChange}
        fullWidth
      >
        {TASK_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {STATUS_LABELS[s]}
          </MenuItem>
        ))}
      </TextField>

      {/* Priority */}
      <TextField
        select
        label="Priority"
        name="priority"
        value={formData.priority}
        onChange={onChange}
        fullWidth
      >
        {TASK_PRIORITIES.map((p) => (
          <MenuItem key={p} value={p}>
            {PRIORITY_LABELS[p]}
          </MenuItem>
        ))}
      </TextField>

      {/* Due Date */}
      <TextField
        type="date"
        label="Due Date"
        name="dueDate"
        value={formData.dueDate}
        onChange={onChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
        inputProps={{ "aria-label": "Due date" }}
      />

      {/* Actions */}
      <Box display="flex" gap={2} mt={1}>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={submitting}
          startIcon={
            submitting ? <CircularProgress size={16} color="inherit" /> : null
          }
          aria-busy={submitting}
        >
          {submitting ? "Saving…" : submitLabel}
        </Button>

        <Button variant="outlined" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </Box>
    </Stack>
  );
};

export default TaskForm;
