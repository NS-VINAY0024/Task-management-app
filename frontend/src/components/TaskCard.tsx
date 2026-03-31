import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { formatDate } from "../utils/formatDate";
import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      onClick={() => navigate(`/task/${task.id}`)}
      sx={{
        cursor: "pointer",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
      }}
      // Accessibility: make the card keyboard-focusable
      tabIndex={0}
      role="button"
      aria-label={`View task: ${task.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(`/task/${task.id}`);
      }}
    >
      <CardContent>
        <Typography variant="h6" noWrap>
          {task.title}
        </Typography>

        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </Stack>

        <Box mt={1}>
          <Typography variant="body2" color="text.secondary">
            Due: {formatDate(task.dueDate)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
