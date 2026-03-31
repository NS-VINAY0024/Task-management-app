import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { PriorityBadge, StatusBadge } from "./StatusBadge";
import { formatDate } from "../utils/formatDate";
import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  onDelete: (task: Task) => void;
  deleting?: boolean;
}

const TaskCard = ({ task, onDelete, deleting = false }: TaskCardProps) => {
  const navigate = useNavigate();
  const accentColor =
    task.priority === "HIGH"
      ? "#c85f51"
      : task.priority === "MEDIUM"
        ? "#d3933b"
        : "#3c8d5a";

  return (
    <Card
      variant="outlined"
      onClick={() => navigate(`/task/${task.id}`)}
      sx={{
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 24px 52px rgba(34, 48, 61, 0.12)",
        },
      }}
      tabIndex={0}
      role="button"
      aria-label={`View task: ${task.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(`/task/${task.id}`);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: 6,
          bgcolor: accentColor,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
        >
          <Box sx={{ pr: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }} noWrap>
              {task.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: 42,
                maxWidth: 560,
              }}
            >
              {task.description?.trim() || "No description added yet."}
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "row", sm: "column" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
            useFlexGap
          >
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          mt={2.5}
        >
          <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
            <CalendarTodayRoundedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              Due {task.dueDate ? formatDate(task.dueDate) : "No deadline"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              size="small"
              variant="text"
              endIcon={<ArrowOutwardRoundedIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/task/${task.id}`);
              }}
            >
              Open
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit/${task.id}`);
              }}
            >
              Edit
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={deleting}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
