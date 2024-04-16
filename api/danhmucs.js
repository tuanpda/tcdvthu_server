const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");
const multer = require("multer");

// danh mục tỉnh thành phố
router.get("/dmtinh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM dm_tinhhuyen order by matinh`);
    const tinh = result.recordset;
    res.json(tinh);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục quận huyện
router.get("/dmquanhuyen", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("matinh", req.query.matinh)
      .query(`SELECT * FROM dm_quanhuyen order by maquanhuyen`);
    const huyen = result.recordset;
    res.json(huyen);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục quận huyện với mã tỉnh
router.get("/dmquanhuyenwithmatinh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("matinh", req.query.matinh)
      .query(
        `SELECT * FROM dm_quanhuyen where matinh=@matinh order by maquanhuyen`
      );
    const huyen = result.recordset;
    res.json(huyen);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục xã phường với mã huyện
router.get("/dmxaphuongwithmahuyen", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maquanhuyen", req.query.maquanhuyen)
      .query(
        `SELECT * FROM dm_xaphuong where maquanhuyen=@maquanhuyen order by maxaphuong`
      );
    const xa = result.recordset;
    res.json(xa);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục hưởng mã bhyt
router.get("/dmmahuongbhyt", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_mahuongbhyt`
      );
    const mabhyt = result.recordset;
    res.json(mabhyt);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục xã phường với mã huyện
router.get("/dmluongcs", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_luongcoso`
      );
    const luongcs = result.recordset;
    res.json(luongcs);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục bệnh viện
router.get("/dmbenhvienwithtinh", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("matinh", req.query.matinh)
      .query(
        `SELECT * FROM dm_benhvien where matinh=@matinh order by matinh`
      );
    const benhvien = result.recordset;
    res.json(benhvien);
  } catch (error) {
    res.status(500).json(error);
  }
});

// loại hình tham gia
router.get("/dmloaihinhtg", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_loaihinhtg order by maloaihinh`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// người thứ
router.get("/dmnguoithu", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_nguoithu order by manguoithu`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// phương thức đóng
router.get("/dmptdong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_phuongthucdong order by maphuongthuc`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// đối tượng đóng
router.get("/dmdtdong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_doituongdong order by madoituong`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;