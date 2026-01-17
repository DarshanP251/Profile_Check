const express = require("express");
const cors = require("cors");
const profileRoutes = require("./routes/profiles");

const app = express();

app.use(cors());
app.use(express.json());

/* TEST ROUTE */
app.get("/test", (req, res) => {
  res.send("Backend is alive");
});

/* PROFILE ROUTES */
app.use("/api/profiles", profileRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
