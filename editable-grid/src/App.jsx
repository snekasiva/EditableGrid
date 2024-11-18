import  { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Box } from "@mui/material";

const App = () => {
  const [rows, setRows] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [newRow, setNewRow] = useState({ name: "", age: "", email: "" });

  // Fetch records
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/records").then((res) => setRows(res.data));
  }, []);

  // Add new record
  const handleAdd = () => {
    axios.post("http://127.0.0.1:5000/api/records", newRow).then((res) => {
      setRows([...rows, res.data]);
      setNewRow({ name: "", age: "", email: "" });
    });
  };

  // Edit record
  const handleSave = (id) => {
    const updatedRow = rows.find((row) => row.id === id);
    axios.put(`http://127.0.0.1:5000/api/records/${id}`, updatedRow).then(() => {
      setIsEditing(null);
    });
  };

  // Delete record
  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:5000/api/records/${id}`).then(() => {
      setRows(rows.filter((row) => row.id !== id));
    });
  };

  return (
    <Box>
      <DataGrid
        rows={rows}
        columns={[
          { field: "id", headerName: "ID", width: 90 },
          {
            field: "name",
            headerName: "Name",
            width: 150,
            editable: isEditing !== null,
          },
          {
            field: "age",
            headerName: "Age",
            width: 110,
            editable: isEditing !== null,
          },
          {
            field: "email",
            headerName: "Email",
            width: 180,
            editable: isEditing !== null,
          },
          {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params) => (
              <>
                {isEditing === params.id ? (
                  <Button onClick={() => handleSave(params.id)}>Save</Button>
                ) : (
                  <Button onClick={() => setIsEditing(params.id)}>Edit</Button>
                )}
                <Button onClick={() => handleDelete(params.id)}>Delete</Button>
              </>
            ),
          },
        ]}
        pageSize={5}
        onRowEditCommit={(params) => {
          const updatedRows = rows.map((row) =>
            row.id === params.id ? { ...row, ...params } : row
          );
          setRows(updatedRows);
        }}
      />
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Name"
          value={newRow.name}
          onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
        />
        <TextField
          label="Age"
          value={newRow.age}
          onChange={(e) => setNewRow({ ...newRow, age: e.target.value })}
        />
        <TextField
          label="Email"
          value={newRow.email}
          onChange={(e) => setNewRow({ ...newRow, email: e.target.value })}
        />
        <Button onClick={handleAdd}>Add Record</Button>
      </Box>
    </Box>
  );
};

export default App;
