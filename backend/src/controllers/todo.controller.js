const todoService = require("../services/todo.service");

const getTodos = async (req, res) => {
    try {
        const todos = await todoService.getTodos();

        res.json({
            success: true,
            data: todos,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "กรุณาระบุ title",
            });
        }

        const todo = await todoService.createTodo(title);

        res.status(201).json({
            success: true,
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { isDone } = req.body;

        if (typeof isDone !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isDone ต้องเป็น true หรือ false",
            });
        }

        const todo = await todoService.updateTodo(id, isDone);

        res.json({
            success: true,
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await todoService.deleteTodo(id);

        res.json({
            success: true,
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
};