import type { ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { TASK_PRIORITIES, TASK_STATUSES } from "../types/task";
import type { TaskFormErrors, TaskFormValues } from "../types/task";

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
  errors: TaskFormErrors;
  apiError: string | null;
  submitting: boolean;
  submitLabel: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Stack spacing={2.5}>
        {apiError && (
          <Alert severity="error" role="alert">
            {apiError}
          </Alert>
        )}

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

        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={onChange}
          fullWidth
        >
          {TASK_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={onChange}
          fullWidth
        >
          {TASK_PRIORITIES.map((priority) => (
            <MenuItem key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          label="Due Date"
          name="dueDate"
          value={formData.dueDate}
          onChange={onChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ "aria-label": "Due date" }}
          error={Boolean(errors.dueDate)}
          helperText={errors.dueDate ?? "Optional"}
        />

        <Box display="flex" gap={2} mt={1}>
          <Button
            variant="contained"
            type="submit"
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : null
            }
            aria-busy={submitting}
          >
            {submitting ? "Saving..." : submitLabel}
          </Button>

          <Button variant="outlined" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default TaskForm;
