const getHello = (req, res) => {
    res.json({
        success: true,
        message: "Hello from Controller",
    });
};

module.exports = {
    getHello,
};