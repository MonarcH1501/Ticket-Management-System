import React, { useState } from 'react';
import api from '../../api/axios';

import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Switch, FormControlLabel
} from '@mui/material';

export default function CategoriesTab({ categories, refresh }) {
  const [dialog, setDialog] = useState({ open: false, data: null });
  const [formData, setFormData] = useState({});

  const openDialog = (cat = {}) => {
    setFormData(cat);
    setDialog({ open: true, data: cat });
  };

  const closeDialog = () => {
    setDialog({ open: false, data: null });
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitch = (e) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }));
  };

  const saveCategory = async () => {
    try {
      if (formData.id) {
        await api.put(`/admin/ticket-categories/${formData.id}`, formData);
      } else {
        await api.post(`/admin/ticket-categories`, formData);
      }

      await refresh();
      closeDialog();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (cat) => {
    if (window.confirm(`Delete category ${cat.name}?`)) {
      await api.delete(`/admin/ticket-categories/${cat.id}`);
      await refresh();
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => openDialog()}>
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat.id}>
                <TableCell>{cat.code}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.department?.name}</TableCell>
                <TableCell>{cat.is_active ? 'Yes' : 'No'}</TableCell>

                <TableCell>
                  <Button onClick={() => openDialog(cat)}>Edit</Button>
                  <Button color="error" onClick={() => deleteCategory(cat)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialog.open} onClose={closeDialog} fullWidth>
        <DialogTitle>
          {formData.id ? 'Edit Category' : 'Add Category'}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Code"
            name="code"
            value={formData.code || ''}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Department ID"
            name="department_id"
            value={formData.department_id || ''}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active || false}
                onChange={handleSwitch}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={saveCategory} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}