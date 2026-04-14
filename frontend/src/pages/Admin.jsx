import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import api from '../api/axios';
import {
  Container, Box, Tabs, Tab, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Chip, Select, MenuItem, Checkbox, ListItemText
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function AdminTabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Admin() {
  const { user } = useContext(AuthContext);

  const [tabValue, setTabValue] = useState(0);

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);

  const [dialog, setDialog] = useState({ open: false, type: '', data: null });
  const [formData, setFormData] = useState({});

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [selectedRoleId, setSelectedRoleId] = useState('');

  const isAdmin = user?.roles?.some(
    r => r.name === 'admin' || r.name === 'superadmin'
  );

  const loadData = async () => {
    try {
      const [rRes, pRes, uRes] = await Promise.all([
        api.get('/admin/roles'),
        api.get('/admin/permissions'),
        api.get('/admin/users')
      ]);

      setRoles(rRes.data);
      setPermissions(pRes.data);
      setUsers(uRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIX ESLINT
  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, [isAdmin]);

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const getUserPermissions = (user) => {
    const rolePerms = user.roles?.flatMap(r => r.permissions || []) || [];
    const directPerms = user.permissions || [];
    const all = [...rolePerms, ...directPerms];

    return Array.from(new Map(all.map(p => [p.id, p])).values());
  };

  const toggleRolePermission = (roleId, permId, checked) => {
    setRoles(prev =>
      prev.map(role => {
        if (role.id !== roleId) return role;

        const updatedPermissions = checked
          ? [...role.permissions, permissions.find(p => p.id === permId)]
          : role.permissions.filter(p => p.id !== permId);

        return { ...role, permissions: updatedPermissions };
      })
    );

    api.post(`/admin/roles/${roleId}/permissions`, {
      permissions: roles
        .find(r => r.id === roleId)
        ?.permissions?.map(p => p.id)
    });
  };

  const handleTabChange = (e, val) => setTabValue(val);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openDialog = (type, data = {}) => {
    setFormData(data);

    if (type === 'user') {
      setSelectedRoles(data.roles?.map(r => r.name) || []);
      setSelectedPermissions(data.permissions?.map(p => p.id) || []);
    }

    setDialog({ open: true, type, data });
  };

  const closeDialog = () => {
    setDialog({ open: false, type: '', data: null });
    setFormData({});
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

      await loadData();
      closeDialog();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (user) => {
    if (window.confirm(`Delete user ${user.name}?`)) {
      try {
        await api.delete(`/admin/users/${user.id}`);
        await loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isAdmin) return <Typography>No access</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4">
          <AdminPanelSettingsIcon /> Admin Panel
        </Typography>
      </Paper>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Users" />
        <Tab label="Roles" />
      </Tabs>

      {/* ================= USERS ================= */}
      <AdminTabPanel value={tabValue} index={0}>
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
                    <Button size="small" onClick={() => openDialog('user', u)}>
                      Edit
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={() => deleteUser(u)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AdminTabPanel>

      {/* ================= ROLES (DROPDOWN STYLE) ================= */}
      <AdminTabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Role Permissions
          </Typography>

          <Select
            fullWidth
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            displayEmpty
            sx={{ mb: 3 }}
          >
            <MenuItem value="">
              <em>Select Role</em>
            </MenuItem>

            {roles.map(role => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>

          {selectedRole && (
            <Box>
              <Typography sx={{ mb: 2 }}>
                Permissions for <b>{selectedRole.name}</b>
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {permissions.map(p => {
                  const checked = selectedRole.permissions.some(
                    rp => rp.id === p.id
                  );

                  return (
                    <Box
                      key={p.id}
                      sx={{
                        width: 250,
                        border: '1px solid #eee',
                        borderRadius: 2,
                        m: 0.5,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={(e) =>
                          toggleRolePermission(
                            selectedRole.id,
                            p.id,
                            e.target.checked
                          )
                        }
                      />
                      <Typography>{p.name}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Paper>
      </AdminTabPanel>

      {/* ================= DIALOG USER ================= */}
      <Dialog open={dialog.open} onClose={closeDialog} fullWidth>
        <DialogTitle>Edit User</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleFormChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email || ''}
            onChange={handleFormChange}
            sx={{ mt: 2 }}
          />

          {/* ROLES */}
          <Box sx={{ mt: 2 }}>
            <Typography>Roles</Typography>
            <Select
              multiple
              fullWidth
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.name}>
                  <Checkbox checked={selectedRoles.includes(role.name)} />
                  <ListItemText primary={role.name} />
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* PERMISSIONS */}
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

          {/* EFFECTIVE */}
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
    </Container>
  );
}   