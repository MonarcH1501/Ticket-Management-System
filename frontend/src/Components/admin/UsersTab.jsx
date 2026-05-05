import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, Chip, Select, MenuItem, Checkbox,
  ListItemText, Typography, IconButton, Stack,
  Alert, Snackbar, Avatar, Tooltip, CircularProgress,
  FormControl, InputLabel
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function UsersTab({ users, roles, refresh }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    unit_id: '',
    department_id: '',
    position_id: ''
  });
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data untuk dropdown
  const [units, setUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  // Fetch units, departments, positions
  useEffect(() => {
    fetchUnits();
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await api.get('/units');
      setUnits(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to fetch units:', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await api.get('/positions');
      setPositions(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
    }
  };

  const openCreate = () => {
    setMode('create');
    setFormData({ 
      name: '', 
      email: '', 
      password: '',
      unit_id: '',
      department_id: '',
      position_id: ''
    });
    setSelectedRoles([]);
    setOpen(true);
  };

  const openEdit = (user) => {
    setMode('edit');
    setFormData({ 
      id: user.id,
      name: user.name, 
      email: user.email,
      unit_id: user.unit_id || '',
      department_id: user.department_id || '',
      position_id: user.position_id || ''
    });
    setSelectedRoles(user.roles?.map(r => r.name) || []);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setFormData({});
    setSelectedRoles([]);
    setMessage('');
    setLoading(false);
  };

  const saveUser = async () => {
    setLoading(true);
    try {
      if (mode === 'create') {
        // Create user with unit, department, position
        await api.post('/admin/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          unit_id: formData.unit_id || null,
          department_id: formData.department_id || null,
          position_id: formData.position_id || null
        });
        
        setMessage({ text: 'User created successfully!', severity: 'success' });
      } else {
        // Update user
        await api.put(`/admin/users/${formData.id}`, {
          name: formData.name,
          email: formData.email,
          unit_id: formData.unit_id || null,
          department_id: formData.department_id || null,
          position_id: formData.position_id || null
        });
        
        // Sync roles if needed
        if (selectedRoles.length > 0) {
          await api.post(`/admin/users/${formData.id}/roles`, {
            roles: selectedRoles
          });
        }
        
        setMessage({ text: 'User updated successfully!', severity: 'success' });
      }
      
      await refresh();
      closeDialog();
    } catch (err) {
      console.error('Save user error:', err);
      setMessage({ 
        text: err.response?.data?.message || 'Operation failed', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (user) => {
    if (window.confirm(`Delete "${user.name}"?`)) {
      try {
        await api.delete(`/admin/users/${user.id}`);
        await refresh();
        setMessage({ text: 'User deleted!', severity: 'success' });
      } catch {
        setMessage({ text: 'Delete failed', severity: 'error' });
      }
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Create User
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#3b82f6' }}>
                      {getInitials(user.name)}
                    </Avatar>
                    <Typography fontWeight={500}>{user.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.unit?.name || '-'}</TableCell>
                <TableCell>{user.department?.name || '-'}</TableCell>
                <TableCell>
                  {user.roles?.map(role => (
                    <Chip key={role.id} label={role.name} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(user)} sx={{ mr: 1 }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => deleteUser(user)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600}>
              {mode === 'create' ? 'Create User' : 'Edit User'}
            </Typography>
            <IconButton onClick={closeDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              size="small"
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              size="small"
            />
            
            {mode === 'create' && (
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />
            )}

            {/* Unit Dropdown */}
            <FormControl fullWidth size="small">
              <InputLabel>Unit</InputLabel>
              <Select
                value={formData.unit_id || ''}
                onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                label="Unit"
              >
                <MenuItem value="">None</MenuItem>
                {units.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Department Dropdown */}
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department_id || ''}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                label="Department"
              >
                <MenuItem value="">None</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Position Dropdown */}
            <FormControl fullWidth size="small">
              <InputLabel>Position</InputLabel>
              <Select
                value={formData.position_id || ''}
                onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                label="Position"
              >
                <MenuItem value="">None</MenuItem>
                {positions.map(pos => (
                  <MenuItem key={pos.id} value={pos.id}>{pos.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Roles */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Roles
              </Typography>
              <Select
                multiple
                fullWidth
                size="small"
                value={selectedRoles}
                onChange={(e) => setSelectedRoles(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.name}>
                    <Checkbox checked={selectedRoles.includes(role.name)} size="small" />
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={saveUser} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (mode === 'create' ? 'Create' : 'Save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={message.severity} sx={{ borderRadius: 2 }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}