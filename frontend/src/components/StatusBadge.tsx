import { alpha, Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";
import type { TaskPriority, TaskStatus } from "../types/task";

// ─── Status ───────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const STATUS_STYLES: Record<TaskStatus, ChipProps["sx"]> = {
  TODO: {
    color: "#5f6b76",
    backgroundColor: alpha("#5f6b76", 0.12),
  },
  IN_PROGRESS: {
    color: "#9a5d11",
    backgroundColor: alpha("#d3933b", 0.18),
  },
  DONE: {
    color: "#2b6d45",
    backgroundColor: alpha("#3c8d5a", 0.18),
  },
};

interface StatusBadgeProps {
  status: TaskStatus;
  size?: ChipProps["size"];
}

export const StatusBadge = ({ status, size = "small" }: StatusBadgeProps) => (
  <Chip
    label={STATUS_LABEL[status]}
    size={size}
    sx={STATUS_STYLES[status]}
    aria-label={`Status: ${STATUS_LABEL[status]}`}
  />
);

// ─── Priority ─────────────────────────────────────────────────────────────────

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const PRIORITY_STYLES: Record<TaskPriority, ChipProps["sx"]> = {
  LOW: {
    color: "#2b6d45",
    backgroundColor: alpha("#3c8d5a", 0.14),
  },
  MEDIUM: {
    color: "#9a5d11",
    backgroundColor: alpha("#d3933b", 0.16),
  },
  HIGH: {
    color: "#983d31",
    backgroundColor: alpha("#c85f51", 0.16),
  },
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: ChipProps["size"];
}

export const PriorityBadge = ({
  priority,
  size = "small",
}: PriorityBadgeProps) => (
  <Chip
    label={PRIORITY_LABEL[priority]}
    size={size}
    sx={PRIORITY_STYLES[priority]}
    aria-label={`Priority: ${PRIORITY_LABEL[priority]}`}
  />
);
