export const formatDate = (iso?: string | null): string => {
  if (!iso) return "N/A";

  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const toDateInputValue = (iso?: string | null): string => {
  if (!iso) return "";
  return iso.split("T")[0];
};

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const isOverdueDate = (iso?: string | null): boolean => {
  if (!iso) return false;
  return new Date(iso) < startOfToday();
};

export const getDueDateLabel = (iso?: string | null): string => {
  if (!iso) return "No deadline";

  const dueDate = new Date(iso);
  const today = startOfToday();
  const diffMs = dueDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    return `Overdue by ${daysOverdue} day${daysOverdue === 1 ? "" : "s"}`;
  }

  if (diffDays === 0) {
    return "Due today";
  }

  if (diffDays === 1) {
    return "Due tomorrow";
  }

  return `Due in ${diffDays} days`;
};
