import { useState, useEffect } from "react"
import api from "../api/axios"

import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Paper
} from "@mui/material"

export default function TicketForm({ onSubmit, loading }) {

  const [file,setFile] = useState(null)

  const [departments,setDepartments] = useState([])
  const [categories,setCategories] = useState([])

  const [form,setForm] = useState({
    title:"",
    description:"",
    department_id:"",
    ticket_category_id:"",
    priority:"medium",
    due_date:""
  })

  useEffect(()=>{

    api.get("/departments")
      .then(res=>setDepartments(res.data))

  },[])

  useEffect(()=>{

    if(!form.department_id) return

    api.get("/ticket-categories",{
      params:{ department_id:form.department_id }
    })
    .then(res=>setCategories(res.data))

  },[form.department_id])


  const handleChange = (e)=>{

    const {name,value} = e.target

    setForm(prev=>({
      ...prev,
      [name]:value,
      ...(name==="department_id" && {ticket_category_id:""})
    }))

  }

  const handleSubmit = (e)=>{
    e.preventDefault()
    onSubmit(form,file)
  }

  return (

    <Grid container spacing={4}>

      {/* LEFT PANEL */}
      <Grid item xs={12} md={4}>

        <Paper
          sx={{
            p:4,
            borderRadius:3,
            background:"#f6f8fb"
          }}
        >

          <Typography variant="h6" sx={{ mb:2 }}>
            Ticket Guide
          </Typography>

          <Typography variant="body2" sx={{ mb:2 }}>
            Submit a ticket to request help from another department.
          </Typography>

          <Typography variant="body2">
            1. Unit approval<br/>
            2. Department approval<br/>
            3. Assigned to PIC<br/>
            4. Work in progress<br/>
            5. Final review
          </Typography>

        </Paper>

      </Grid>


      {/* FORM PANEL */}
      <Grid item xs={12} md={8}>

        <Paper sx={{ p:4, borderRadius:3 }}>

          <Typography variant="h5" sx={{ mb:3 }}>
            Create Ticket
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>

            <Grid container spacing={3}>

              {/* TITLE */}
              <Grid item xs={12}>

                <TextField
                  label="Title"
                  name="title"
                  fullWidth
                  value={form.title}
                  onChange={handleChange}
                />

              </Grid>


              {/* DEPARTMENT */}
              <Grid item xs={12} md={6}>

                <TextField
                  label="Department"
                  name="department_id"
                  select
                  fullWidth
                  value={form.department_id}
                  onChange={handleChange}
                >

                  {departments.map(dep=>(
                    <MenuItem key={dep.id} value={dep.id}>
                      {dep.name}
                    </MenuItem>
                  ))}

                </TextField>

              </Grid>


              {/* CATEGORY */}
              <Grid item xs={12} md={6}>

                <TextField
                  label="Category"
                  name="ticket_category_id"
                  select
                  fullWidth
                  disabled={!form.department_id}
                  value={form.ticket_category_id}
                  onChange={handleChange}
                >

                  {categories.map(cat=>(
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}

                </TextField>

              </Grid>


              {/* PRIORITY */}
              <Grid item xs={12} md={6}>

                <TextField
                  label="Priority"
                  name="priority"
                  select
                  fullWidth
                  value={form.priority}
                  onChange={handleChange}
                >

                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>

                </TextField>

              </Grid>


              {/* DUE DATE */}
              <Grid item xs={12} md={6}>

                <TextField
                  label="Due Date"
                  name="due_date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink:true }}
                  value={form.due_date}
                  onChange={handleChange}
                />

              </Grid>


              {/* DESCRIPTION */}
              <Grid item xs={12}>

                <TextField
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  fullWidth
                  value={form.description}
                  onChange={handleChange}
                />

              </Grid>


              {/* ATTACHMENT */}
              <Grid item xs={12}>

                <Button
                  variant="outlined"
                  component="label"
                >
                  Upload Attachment

                  <input
                    type="file"
                    hidden
                    onChange={(e)=>setFile(e.target.files[0])}
                  />

                </Button>

                {file && (
                  <Typography sx={{ mt:1 }}>
                    {file.name}
                  </Typography>
                )}

              </Grid>


              {/* SUBMIT */}
              <Grid item xs={12}>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Ticket"}
                </Button>

              </Grid>

            </Grid>

          </Box>

        </Paper>

      </Grid>

    </Grid>

  )

}