require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");

const connectDB = require("./config/db");

const referencesRoutes = require("./routes/referencesRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const servicesRoutes = require("./routes/servicesRoutes");
const usersRoutes = require("./routes/usersRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/references", referencesRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Portfolio Backend API running" });
});

app.use((req, res, next) => next(createError(404, "Endpoint not found")));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};

startServer();