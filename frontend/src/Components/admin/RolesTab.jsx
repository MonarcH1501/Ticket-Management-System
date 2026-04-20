import React, { useState } from 'react';
import api from '../../api/axios';

import {
  Paper, Typography, Select, MenuItem, Box, Checkbox
} from '@mui/material';

export default function RolesTab({ roles, permissions, setRoles }) {
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const selectedRole = roles.find(r => r.id === selectedRoleId);

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

  return (
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
  );
}