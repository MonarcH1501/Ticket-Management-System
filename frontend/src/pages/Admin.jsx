import { useState, useEffect, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth-context'
import api from '../api/axios'
import { Tabs, Tab } from '@mui/material'
import {
  PRIMARY,
  PRIMARY_BG,
  PRIMARY_BORDER,
  SHADOW_SUBTLE
} from '../theme/colors'

import UsersTab from '../Components/admin/UsersTab'
import RolesTab from '../Components/admin/RolesTab'
import CategoriesTab from '../Components/admin/CategoriesTab'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <div style={{ paddingTop: 20 }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [tab, setTab] = useState(0)

  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])

  const isAdmin = user?.roles?.some(r =>
    ['admin', 'superadmin'].includes(r.name)
  )

  // Redirect unauthorized users
  useEffect(() => {
    if (user && !isAdmin) {
      navigate('/403', { replace: true })
    }
  }, [user, isAdmin, navigate])

  // Shared refresh function
  const loadData = useCallback(async () => {
    try {
      const [rRes, pRes, uRes, cRes] = await Promise.all([
        api.get('/admin/roles'),
        api.get('/admin/permissions'),
        api.get('/admin/users'),
        api.get('/admin/ticket-categories')
      ])

      setRoles(rRes.data)
      setPermissions(pRes.data)
      setUsers(uRes.data)
      setCategories(cRes.data)

    } catch (err) {
      console.error(err)

      if (err.response?.status === 403) {
        navigate('/403', { replace: true })
      }

      if (err.response?.status === 500) {
        navigate('/500', { replace: true })
      }
    }
  }, [navigate])

  // Initial data load
  useEffect(() => {
    if (!isAdmin) return

    const init = async () => {
      await loadData()
    }

    init()
  }, [isAdmin, loadData])

  if (!isAdmin) return null

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#94a3b8',
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            marginBottom: 4
          }}
        >
          System
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#0c4a6e'
          }}
        >
          Admin Panel
        </div>

        <div
          style={{
            fontSize: 13,
            color: '#64748b',
            marginTop: 2
          }}
        >
          Manage users, roles, and ticket categories
        </div>
      </div>

      {/* Main Card */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: `1px solid ${PRIMARY_BORDER}`,
          boxShadow: SHADOW_SUBTLE,
          overflow: 'hidden'
        }}
      >
        {/* Tabs */}
        <div
          style={{
            borderBottom: `1px solid ${PRIMARY_BG}`,
            padding: '0 20px'
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              minHeight: 44,

              '& .MuiTabs-indicator': {
                backgroundColor: PRIMARY,
                height: 2.5,
                borderRadius: 99
              },

              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: 13,
                color: '#94a3b8',
                minHeight: 44,
                fontFamily: "'DM Sans', sans-serif",
                px: 2
              },

              '& .Mui-selected': {
                color: `${PRIMARY} !important`
              }
            }}
          >
            <Tab label="👤 Users" />
            <Tab label="🔐 Roles & Permissions" />
            <Tab label="🗂️ Categories" />
          </Tabs>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          <TabPanel value={tab} index={0}>
            <UsersTab
              users={users}
              roles={roles}
              permissions={permissions}
              refresh={loadData}
            />
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <RolesTab
              roles={roles}
              permissions={permissions}
              setRoles={setRoles}
              setPermissions={setPermissions}
              refresh={loadData}
            />
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <CategoriesTab
              categories={categories}
              refresh={loadData}
            />
          </TabPanel>
        </div>
      </div>
    </div>
  )
}