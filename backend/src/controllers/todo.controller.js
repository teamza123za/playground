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

module.exports = {
    getTodos,
    createTodo,
};