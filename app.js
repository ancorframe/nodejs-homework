const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/api/user");
const contactsRouter = require("./routes/api/contacts");
const avatarRouter = require("./routes/api/avatar");
const { errorHandler } = require("./helpers/apiHelpers");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", userRouter);
app.use("/avatars", avatarRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

module.exports = app;
