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

module.exports = {
    getTodos,
    createTodo,
};