const express = require("express");
const validateEmotionText = require("../utils/validateEmotion");

function createEmotionRoutes(pool) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      const { text } = req.body;

      const error = validateEmotionText(text);
      if (error) {
        return res.status(400).json({ error });
      }

      const result = await pool.query(
        "INSERT INTO emotions (text) VALUES ($1) RETURNING *",
        [text]
      );

      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const result = await pool.query(
        "SELECT * FROM emotions ORDER BY created_at DESC"
      );

      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = createEmotionRoutes;

  