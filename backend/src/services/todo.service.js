const prisma = require("../config/prisma");

const getTodos = async () => {
    return await prisma.todo.findMany({
        orderBy: {
            id: "desc",
        },
    });
};

const createTodo = async (title) => {
    return await prisma.todo.create({
        data: {
            title,
        },
    });
};

const updateTodo = async (id, isDone) => {
    return await prisma.todo.update({
        where: {
            id: Number(id),
        },
        data: {
            isDone,
        },
    });
};

const deleteTodo = async (id) => {
    return await prisma.todo.delete({
        where: {
            id: Number(id),
        },
    });
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
};