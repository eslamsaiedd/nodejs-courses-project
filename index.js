require("dotenv").config();
const express = require("express");

const path = require('node:path')
const cors = require("cors");

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const mongoose = require("mongoose");

const httpStatus = require("./utilities/http.status.txt");
app.use(cors());

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log("mongo server started");
});

app.use(express.json());

const coursesRouter = require("./routes/courses.routes");
const usersRouter = require("./routes/users.routes");

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);


//! global error handler
app.use((error, req, res, next) => {
  res
  .status(error.statusCode || 500)
  .json({
    status: error.statusText || httpStatus.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});


//! global middleware for not found router
app.use((req, res) => {
  return res.status(404).json({
    status: httpStatus.ERROR,
    message: "This resource is not available",
  });
});

app.listen(process.env.PORT || 5001, () => {
  console.log("listening on port: 5001");
});

