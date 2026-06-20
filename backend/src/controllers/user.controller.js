const userService = require("../services/user.service");

const getUsers = (req, res) => {
    const users = userService.getUsers();

    res.json({
        success: true,
        data: users,
    });
};

module.exports = {
    getUsers,
};