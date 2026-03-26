import { useState, useEffect } from "react";
import api from "../api/axios";

import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Paper
} from "@mui/material";

export default function TicketForm({ onSubmit, loading }) {

  const [file, setFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    department_id: "",
    ticket_category_id: "",
    priority: "medium",
    due_date: ""
  });

  useEffect(() => {
    api.get("/departments")
      .then(res => setDepartments(res.data));
  }, []);

  useEffect(() => {
    if (!form.department_id) return;

    api.get("/ticket-categories", {
      params: { department_id: form.department_id }
    })
    .then(res => setCategories(res.data));

  }, [form.department_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "department_id" && { ticket_category_id: "" })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, file);
  };

  return (

    <Box sx={{ width: "100%" }}>

      {/* 💡 MINI GUIDE */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          background: "#f1f5f9",
          border: "1px solid #e2e8f0"
        }}
      >
        <Typography fontSize={14} color="text.secondary">
          💡 Submit a ticket  Process: approval Kepala Unit → Kepala Department → PIC work → review KD.
        </Typography>
      </Box>

      {/* 🔵 FORM */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          Create Ticket
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr"
            },
            gap: 3
          }}
        >

          {/* TITLE FULL */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography fontWeight={600} mb={1}>Title</Typography>
            <TextField
              name="title"
              fullWidth
              placeholder="Enter ticket title..."
              value={form.title}
              onChange={handleChange}
              sx={{ background: "#fff", borderRadius: 2 }}
            />
          </Box>

          {/* DEPARTMENT */}
          <Box>
            <Typography fontWeight={600} mb={1}>Department</Typography>
            <TextField
              name="department_id"
              select
              fullWidth
              value={form.department_id}
              onChange={handleChange}
              sx={{ background: "#fff", borderRadius: 2 }}
            >
              <MenuItem value="">Select Department</MenuItem>
              {departments.map(dep => (
                <MenuItem key={dep.id} value={dep.id}>
                  {dep.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* CATEGORY */}
          <Box>
            <Typography fontWeight={600} mb={1}>Category</Typography>
            <TextField
              name="ticket_category_id"
              select
              fullWidth
              disabled={!form.department_id}
              value={form.ticket_category_id}
              onChange={handleChange}
              sx={{ background: "#fff", borderRadius: 2 }}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* PRIORITY */}
          <Box>
            <Typography fontWeight={600} mb={1}>Priority</Typography>
            <TextField
              name="priority"
              select
              fullWidth
              value={form.priority}
              onChange={handleChange}
              sx={{ background: "#fff", borderRadius: 2 }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
          </Box>

          {/* DATE */}
          <Box>
            <Typography fontWeight={600} mb={1}>Due Date</Typography>
            <TextField
              name="due_date"
              type="date"
              fullWidth
              value={form.due_date}
              onChange={handleChange}
              sx={{ background: "#fff", borderRadius: 2 }}
            />
          </Box>

          {/* DESCRIPTION FULL */}
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography fontWeight={600} mb={1}>Description</Typography>
            <TextField
              name="description"
              multiline
              rows={4}
              fullWidth
              placeholder="Describe your issue..."
              value={form.description}
              onChange={handleChange}
              sx={{ background: "#fff", borderRadius: 2 }}
            />
          </Box>

          {/* ACTIONS FULL */}
          <Box
            sx={{
              gridColumn: "1 / -1",
              display: "flex",
              gap: 2,
              alignItems: "center"
            }}
          >
            <Button
              variant="outlined"
              component="label"
              sx={{ borderRadius: 2 }}
            >
              Upload Attachment
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>

            {file && (
              <Typography fontSize={13}>
                {file.name}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                boxShadow: "0 6px 20px rgba(99,102,241,0.4)"
              }}
            >
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
          </Box>

        </Box>
      </Paper>

    </Box>
  );
}