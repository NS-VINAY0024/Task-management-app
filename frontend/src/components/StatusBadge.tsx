import { Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";
import type { TaskPriority, TaskStatus } from "../types/task";

// ─── Status ───────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const STATUS_COLOR: Record<TaskStatus, ChipProps["color"]> = {
  TODO: "default",
  IN_PROGRESS: "warning",
  DONE: "success",
};

interface StatusBadgeProps {
  status: TaskStatus;
  size?: ChipProps["size"];
}

export const StatusBadge = ({ status, size = "small" }: StatusBadgeProps) => (
  <Chip
    label={STATUS_LABEL[status]}
    color={STATUS_COLOR[status]}
    size={size}
    aria-label={`Status: ${STATUS_LABEL[status]}`}
  />
);

// ─── Priority ─────────────────────────────────────────────────────────────────

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const PRIORITY_COLOR: Record<TaskPriority, ChipProps["color"]> = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "error",
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
    color={PRIORITY_COLOR[priority]}
    size={size}
    aria-label={`Priority: ${PRIORITY_LABEL[priority]}`}
  />
);
