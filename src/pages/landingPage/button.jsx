import * as React from "react";
import Stack from "@mui/material/Stack";  // ✅ Correct Import
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function BasicButtons() {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={() => navigate("/signin")}>
        Start
      </Button>
    </Stack>
  );
}
