require("dotenv").config();

const express = require("express");
const cors = require("cors");

const helloRoute = require("./routes/hello.route");
const userRoute = require("./routes/user.route");
const todoRoute = require("./routes/todo.route");

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://www.slowwork.site",
            "https://slowwork.site",
        ],
        credentials: true,
    }),
);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend Running",
    });
});

app.use("/api", helloRoute);
app.use("/api", userRoute);
app.use("/api", todoRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});