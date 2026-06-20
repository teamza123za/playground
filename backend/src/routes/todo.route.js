const express = require("express");
const {
    getTodos,
    createTodo,
} = require("../controllers/todo.controller");

const router = express.Router();

router.get("/todos", getTodos);
router.post("/todos", createTodo);

module.exports = router;