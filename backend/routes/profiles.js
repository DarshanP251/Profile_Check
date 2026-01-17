const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const pool = require("../db");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* ---------- MANUAL ENTRY ---------- */
router.post("/add", async (req, res) => {
  const { name, dob, gender, email, mobile } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO profiles (name, dob, gender, email, mobile)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING name,email`,
      [name, dob, gender, email, mobile]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* ---------- CSV BULK UPLOAD ---------- */
router.post("/upload", upload.single("file"), (req, res) => {
  const results = [];
  const success = [];
  const failed = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", row => results.push(row))
    .on("end", async () => {
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        const rowNo = i + 2;

        try {
          if (!r.Name || !r.DOB || !r.Gender || !r.Email || !r.Mobile)
            throw new Error("Missing required fields");

          await pool.query(
            `INSERT INTO profiles (name, dob, gender, email, mobile)
             VALUES ($1,$2,$3,$4,$5)`,
            [r.Name, r.DOB, r.Gender, r.Email, r.Mobile]
          );

          success.push({ name: r.Name, email: r.Email });
        } catch (err) {
          failed.push({
            row: rowNo,
            reason: err.message
          });
        }
      }

      fs.unlinkSync(req.file.path);

      res.json({
        total: results.length,
        inserted: success.length,
        failed: failed.length,
        success,
        failed
      });
    });
});

module.exports = router;
