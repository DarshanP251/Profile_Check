const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const profileRoutes = require("./routes/profiles");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Serve frontend (public folder outside backend) */
app.use(express.static(path.join(__dirname, "..", "public")));

/* Root route → profiles.html */
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public", "pages", "profiles.html")
  );
});

/* Health check */
app.get("/test", (req, res) => {
  res.send("Backend is alive");
});

/* API routes */
app.use("/api/profiles", profileRoutes);

/* Render port */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
