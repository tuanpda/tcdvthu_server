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

// danh mục xã phường
router.get("/dmxaphuong", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_xaphuong order by maxaphuong`
      );
    const xa = result.recordset;
    res.json(xa);
  } catch (error) {
    res.status(500).json(error);
  }
});

// danh mục xã phường & phân trang
router.get("/get-all-xaphuongwithphantrang", async (req, res) => {
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
        `SELECT * FROM dm_xaphuong ORDER BY _id desc OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`
      );

    const data = result.recordset;

    // Đếm tổng số lượng bản ghi
    const countResult = await pool
      .request()
      .query(
        `SELECT COUNT(*) AS totalCount FROM dm_xaphuong`
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
        `SELECT * FROM dm_phuongthucdong order by orderstt`
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

// ty le ho tro
router.get("/tylehotro", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_tylehotro where active=1`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ty le ho tro
router.get("/tylehotroall", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_tylehotro`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ty le đóng BHXH Tự nguyện IS
router.get("/tyledongbhtn", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_tyledong where active=1`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ty le đóng BHXH Tự nguyện IS all
router.get("/tyledongbhtnall", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_tyledong`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// chuẩn nghèo BHXH Tự nguyện IS
router.get("/mucchuanngheo", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_chuanngheo where active=1`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// chuẩn nghèo BHXH Tự nguyện IS all
router.get("/mucchuanngheoall", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_chuanngheo`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tỷ lệ địa phương hỗ trợ IS
router.get("/diaphuonghtis", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_tylediaphuonghtis where active=1`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tỷ lệ địa phương hỗ trợ IS all
router.get("/diaphuonghtisall", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dm_tylediaphuonghtis`
      );
    const kq = result.recordset;
    res.json(kq);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;