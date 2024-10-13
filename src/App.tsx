import React, { useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  IconButton,
  ListItemText,
  Modal,
  Box,
  Snackbar,
} from "@mui/material";
import { Alert } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterListIcon,
  TaskAlt as TaskAltIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import "./App.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const useStyles = makeStyles({
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "24px",
    padding: "20px",
    outline: "none",
  },
  modalTitle: {
    marginBottom: "16px",
    fontWeight: 600,
    fontSize: "20px",
  },
  addButton: {
    backgroundColor: "#0FA7E6",
    color: "#fff",

    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "#007bb5",
      transform: "scale(1.05)",
    },
  },
  filterButton: {
    borderRadius: "8px",
    margin: "0 4px",
    padding: "8px 16px",
    color: "#fff",
    fontWeight: "bold",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s, transform 0.2s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  allButton: {
    backgroundColor: "#4CAF50",
  },
  activeButton: {
    backgroundColor: "#2196F3",
  },
  completedButton: {
    backgroundColor: "#FFC107",
  },
  clearButton: {
    backgroundColor: "#FF5252",
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#0FA7E6",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#007bb5",
    },
  },
});

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const classes = useStyles();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const handleAddTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput("");
      showSnackbar("Todo added successfully!");
    }
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    showSnackbar("Todo deleted successfully!");
  };

  const handleEditTodo = (todo: Todo) => {
    setEditTodo(todo);
    setOpenEditModal(true);
  };

  const handleSaveEdit = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editTodo?.id ? { ...todo, text: editTodo.text } : todo
      )
    );
    setOpenEditModal(false);
    setEditTodo(null);
    showSnackbar("Todo edited successfully!");
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    showSnackbar("Cleared completed tasks!");
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4 font-montserrat">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#0FA7E6] flex justify-center items-center">
          <TaskAltIcon className="mr-2" />
          Todo App
        </h1>

        <div className="mb-4 flex">
          <TextField
            style={{ marginRight: "10px" }}
            variant="outlined"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            label="What needs to be done?"
            className="font-montserrat "
            InputLabelProps={{
              style: { fontFamily: "Montserrat" },
            }}
            size="small"
          />
          <Button
            onClick={handleAddTodo}
            className={`ml-2 ${classes.addButton} font-montserrat`}
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
          >
            Add
          </Button>
        </div>

        <List>
          {filteredTodos.map((todo) => (
            <ListItem key={todo.id} divider>
              <ListItemIcon>
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                />
              </ListItemIcon>
              <ListItemText
                className="font-montserrat"
                primary={todo.text}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "red" : "black",
                }}
              />
              <IconButton color="primary" onClick={() => handleEditTodo(todo)}>
                <EditIcon style={{ color: "#0FA7E6" }} />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <DeleteIcon style={{ color: "#FF5252" }} />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <div className="flex justify-between mt-4 items-center ">
          <span>{filteredTodos.length} items left</span>
          <div>
            <Button
              style={{ marginRight: "10px" }}
              variant={filter === "all" ? "contained" : "outlined"}
              onClick={() => setFilter("all")}
              className={`${classes.filterButton} ${classes.allButton} font-montserrat`}
              startIcon={
                <FilterListIcon
                  style={{ color: filter === "all" ? "#fff" : "#2196F3" }}
                />
              }
            >
              All
            </Button>
            <Button
              style={{ marginRight: "10px" }}
              variant={filter === "active" ? "contained" : "outlined"}
              onClick={() => setFilter("active")}
              className={`${classes.filterButton} ${classes.activeButton} font-montserrat mr-2`}
              startIcon={
                <CheckCircleIcon
                  style={{ color: filter === "active" ? "#fff" : "#2196F3" }}
                />
              }
            >
              Active
            </Button>
            <Button
              style={{ marginRight: "10px" }}
              variant={filter === "completed" ? "contained" : "outlined"}
              onClick={() => setFilter("completed")}
              className={`${classes.filterButton} ${classes.completedButton} font-montserrat mr-2`}
              startIcon={
                <CheckCircleIcon
                  style={{ color: filter === "completed" ? "#fff" : "#2196F3" }}
                />
              }
            >
              Completed
            </Button>
            <Button
              onClick={handleClearCompleted}
              className={`${classes.filterButton} ${classes.clearButton} font-montserrat`}
              startIcon={
                <DeleteForeverIcon
                  style={{ color: filter === "completed" ? "#fff" : "#2196F3" }}
                />
              }
              variant="outlined"
            >
              Clear Completed
            </Button>
          </div>
        </div>

        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box className={classes.modalBox}>
            <h2 className={classes.modalTitle}>Edit Task</h2>
            <TextField
              fullWidth
              value={editTodo?.text || ""}
              onChange={(e) =>
                setEditTodo({ ...editTodo!, text: e.target.value })
              }
              label="Edit your task"
              variant="outlined"
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                className={classes.saveButton}
              >
                Save
              </Button>
            </div>
          </Box>
        </Modal>

        <Snackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%", backgroundColor: "#4CAF50", color: "white" }}
            iconMapping={{
              success: (
                <CheckCircleIcon
                  style={{ color: "white" }}
                  fontSize="inherit"
                />
              ),
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default App;
