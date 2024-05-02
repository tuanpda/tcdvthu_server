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
      .input("MaSoBhxh", req.query.MaSoBhxh)
      .query(`SELECT * FROM quanlynguoihuong where MaSoBhxh=@MaSoBhxh`);
    const nguoihuong = result.recordset;
    res.json(nguoihuong);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tim nguoi huong theo cccd
router.get("/find-nguoihuong-cccd", async (req, res) => {
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

// tìm tên tỉnh theo mã tỉnh
router.get("/find-tentinh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("matinh", req.query.matinh)
      .query(`SELECT tentinh FROM dm_tinhhuyen where matinh=@matinh`);
    const nguoihuong = result.recordset;
    res.json(nguoihuong);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm tên huyện theo mã huyện
router.get("/find-tenhuyen", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("matinh", req.query.matinh)
      .input("maquanhuyen", req.query.maquanhuyen)
      .query(
        `SELECT tenquanhuyen FROM dm_quanhuyen where matinh=@matinh and maquanhuyen=@maquanhuyen`
      );
    const nguoihuong = result.recordset;
    res.json(nguoihuong);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm tên xã
router.get("/find-tenxa", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("matinh", req.query.matinh)
      .input("maquanhuyen", req.query.maquanhuyen)
      .input("maxaphuong", req.query.maxaphuong)
      .query(
        `SELECT tenxaphuong FROM dm_xaphuong where matinh=@matinh and maquanhuyen=@maquanhuyen and maxaphuong=@maxaphuong`
      );
    const nguoihuong = result.recordset;
    res.json(nguoihuong);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm tên huyện theo mã huyện
router.get("/find-benhvien", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("mabenhvien", req.query.mabenhvien)
      .query(
        `SELECT tenbenhvien FROM dm_benhvien where mabenhvien=@mabenhvien`
      );
    const nguoihuong = result.recordset;
    res.json(nguoihuong);
  } catch (error) {
    res.status(500).json(error);
  }
});

// quan lý lao động phân trang
router.get("/get-all-quanlylaodong-pagi", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Chuyển đổi page thành số nguyên
    const limit = parseInt(req.query.limit, 20) || 20;
    const offset = (page - 1) * limit;
    // console.log(offset);
    // console.log(typeof(offset));

    await pool.connect();
    const result = await pool
      .request()
      .input("offset", offset)
      .input("limit", limit)
      .query(
        `SELECT * FROM quanlynguoihuong ORDER BY _id desc OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`
      );

    const data = result.recordset;

    // Đếm tổng số lượng bản ghi
    const countResult = await pool
      .request()
      .query(
        `SELECT COUNT(*) AS totalCount FROM quanlynguoihuong`
      );
    const totalCount = countResult.recordset[0].totalCount;

    const totalPages = Math.ceil(totalCount / limit);

    const info = {
      count: totalCount,
      pages: totalPages,
      next:
        page < totalPages
          ? `${req.path}?page=${page + 1}`
          : null,
      prev:
        page > 1 ? `${req.path}?page=${page - 1}` : null,
    };

    // Tạo đối tượng JSON phản hồi
    const response = {
      info: info,
      results: data,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
