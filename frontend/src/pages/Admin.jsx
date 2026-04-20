import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import api from '../api/axios';

import {
  Container, Box, Tabs, Tab, Typography, Paper
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import UserTab from '../Components/admin/UsersTab';
import RoleTab from '../Components/admin/RolesTab';
import CategoriesTab from '../Components/admin/CategoriesTab'; // ✅ NEW

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
  const [categories, setCategories] = useState([]); // ✅ NEW

  const isAdmin = user?.roles?.some(
    r => r.name === 'admin' || r.name === 'superadmin'
  );

  const loadData = async () => {
    try {
      const [rRes, pRes, uRes, cRes] = await Promise.all([
        api.get('/admin/roles'),
        api.get('/admin/permissions'),
        api.get('/admin/users'),
        api.get('/admin/ticket-categories') // ✅ NEW
      ]);

      setRoles(rRes.data);
      setPermissions(pRes.data);
      setUsers(uRes.data);
      setCategories(cRes.data); // ✅ NEW
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, [isAdmin]);

  if (!isAdmin) return <Typography>No access</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4">
          <AdminPanelSettingsIcon /> Admin Panel
        </Typography>
      </Paper>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
        <Tab label="Users" />
        <Tab label="Roles" />
        <Tab label="Categories" /> {/* ✅ NEW */}
      </Tabs>

      <AdminTabPanel value={tabValue} index={0}>
        <UserTab
          users={users}
          roles={roles}
          permissions={permissions}
          refresh={loadData}
        />
      </AdminTabPanel>

      <AdminTabPanel value={tabValue} index={1}>
        <RoleTab
          roles={roles}
          permissions={permissions}
          setRoles={setRoles}
        />
      </AdminTabPanel>

      <AdminTabPanel value={tabValue} index={2}>
        <CategoriesTab
          categories={categories}
          refresh={loadData}
        />
      </AdminTabPanel>
    </Container>
  );
}