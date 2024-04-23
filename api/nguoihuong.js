const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");
const multer = require("multer");

// tim nguoi huong theo ma so bhxh
router.get("/find-nguoihuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("masobhxh", req.query.masobhxh)
      .query(`SELECT * FROM quanlynguoihuong where masobhxh=@masobhxh`);
    const nguoihuong = result.recordset;
    res.json(nguoihuong);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tim nguoi huong theo cccd
router.get("/find-nguoihuong", async (req, res) => {
    try {
      await pool.connect();
      const result = await pool
        .request()
        .input("cccd", req.query.cccd)
        .query(`SELECT * FROM quanlynguoihuong where cccd=@cccd`);
      const nguoihuong = result.recordset;
      res.json(nguoihuong);
    } catch (error) {
      res.status(500).json(error);
    }
  });


module.exports = router;