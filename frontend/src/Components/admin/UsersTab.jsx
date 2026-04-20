import React, { useState } from 'react';
import api from '../../api/axios';

import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, Chip, Select, MenuItem, Checkbox, ListItemText, Typography
} from '@mui/material';

export default function UsersTab({ users, roles, permissions, refresh }) {
  const [dialog, setDialog] = useState({ open: false, data: null });
  const [formData, setFormData] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const openDialog = (user) => {
    setFormData(user);
    setSelectedRoles(user.roles?.map(r => r.name) || []);
    setSelectedPermissions(user.permissions?.map(p => p.id) || []);
    setDialog({ open: true, data: user });
  };

  const closeDialog = () => {
    setDialog({ open: false, data: null });
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUser = async () => {
    try {
      await api.put(`/admin/users/${formData.id}`, formData);

      await api.post(`/admin/users/${formData.id}/roles`, {
        roles: selectedRoles
      });

      await api.post(`/admin/users/${formData.id}/permissions`, {
        permissions: selectedPermissions
      });

      await refresh();
      closeDialog();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (user) => {
    if (window.confirm(`Delete user ${user.name}?`)) {
      await api.delete(`/admin/users/${user.id}`);
      await refresh();
    }
  };

  const getUserPermissions = (user) => {
    const rolePerms = user.roles?.flatMap(r => r.permissions || []) || [];
    const directPerms = user.permissions || [];
    const all = [...rolePerms, ...directPerms];

    return Array.from(new Map(all.map(p => [p.id, p])).values());
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>

                <TableCell>
                  {u.roles.map(r => (
                    <Chip key={r.id} label={r.name} sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>

                <TableCell>
                  <Button onClick={() => openDialog(u)}>Edit</Button>
                  <Button color="error" onClick={() => deleteUser(u)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialog.open} onClose={closeDialog} fullWidth>
        <DialogTitle>Edit User</DialogTitle>

        <DialogContent>
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
            label="Email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          {/* Roles */}
          <Box sx={{ mt: 2 }}>
            <Typography>Roles</Typography>
            <Select
              multiple
              fullWidth
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.target.value)}
              renderValue={(s) => s.join(', ')}
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.name}>
                  <Checkbox checked={selectedRoles.includes(role.name)} />
                  <ListItemText primary={role.name} />
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Permissions */}
          <Box sx={{ mt: 2 }}>
            <Typography>Permissions</Typography>
            <Select
              multiple
              fullWidth
              value={selectedPermissions}
              onChange={(e) => setSelectedPermissions(e.target.value)}
              renderValue={(selected) =>
                permissions
                  .filter(p => selected.includes(p.id))
                  .map(p => p.name)
                  .join(', ')
              }
            >
              {permissions.map(p => (
                <MenuItem key={p.id} value={p.id}>
                  <Checkbox checked={selectedPermissions.includes(p.id)} />
                  <ListItemText primary={p.name} />
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Effective */}
          <Box sx={{ mt: 2 }}>
            <Typography>Effective Permissions</Typography>
            {getUserPermissions(formData).map(p => (
              <Chip key={p.id} label={p.name} sx={{ m: 0.5 }} />
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={saveUser} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}