import express from "express";
const router = express.Router();

router.get("/conversations", (req, res) => {
  res.status(200).json({ status: "success" });
});
router.get("/:id", (req, res) => {
  res.status(200).json({ status: "success" });
});
router.post("/send/:id", (req, res) => {
  res.status(200).json({ status: "success" });
});

export default router;
