import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", pt: { xs: 6, md: 10 } }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={2.5} alignItems="flex-start">
            <Box
              sx={{
                width: 56,
                height: 56,
                display: "grid",
                placeItems: "center",
                borderRadius: 4,
                backgroundColor: "rgba(31,111,120,0.12)",
                color: "primary.main",
              }}
            >
              <SearchOffRoundedIcon />
            </Box>
            <div>
              <Typography variant="h3" component="h1" gutterBottom>
                This page wandered off.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The route you opened does not exist anymore, or the link was never
                valid in this workspace.
              </Typography>
            </div>
            <Button
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              onClick={() => navigate("/")}
            >
              Go to task list
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotFoundPage;
