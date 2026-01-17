const express = require("express");
const cors = require("cors");
require("dotenv").config();

const profileRoutes = require("./routes/profiles");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Health Check Route */
app.get("/test", (req, res) => {
  res.send("Backend is alive");
});

/* API Routes */
app.use("/api/profiles", profileRoutes);

/* Render provides PORT dynamically */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
