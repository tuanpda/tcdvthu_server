const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");
const sql = require("mssql");

// add ke khai
router.post("/add-kekhai", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("matochuc", req.body.matochuc)
      .input("tentochuc", req.body.tentochuc)
      .input("madaily", req.body.madaily)
      .input("tendaily", req.body.tendaily)
      .input("maloaihinh", req.body.maloaihinh)
      .input("tenloaihinh", req.body.tenloaihinh)
      .input("hoten", req.body.hoten)
      .input("masobhxh", req.body.masobhxh)
      .input("cccd", req.body.cccd)
      .input("dienthoai", req.body.dienthoai)
      .input("maphuongan", req.body.maphuongan)
      .input("tenphuongan", req.body.tenphuongan)
      .input("ngaysinh", req.body.ngaysinh)
      .input("gioitinh", req.body.gioitinh)
      .input("nguoithu", req.body.nguoithu)
      .input("tienluongcs", req.body.tienluongcs)
      .input("sotien", req.body.sotien)
      .input("tylengansachdiaphuong", req.body.tylengansachdiaphuong)
      .input("hotrokhac", req.body.hotrokhac)
      .input("tungay", req.body.tungay)
      .input("heso", req.body.heso)
      .input("tyledong", req.body.tyledong)
      .input("muctiendong", req.body.muctiendong)
      .input("maphuongthucdong", req.body.maphuongthucdong)
      .input("tenphuongthucdong", req.body.tenphuongthucdong)
      .input("sothang", req.body.sothang)
      .input("tuthang", req.body.tuthang)
      .input("tientunguyendong", req.body.tientunguyendong)
      .input("tienlai", req.body.tienlai)
      .input("madoituong", req.body.madoituong)
      .input("tendoiduong", req.body.tendoiduong)
      .input("tylensnnht", req.body.tylensnnht)
      .input("tiennsnnht", req.body.tiennsnnht)
      .input("tylensdp", req.body.tylensdp)
      .input("tiennsdp", req.body.tiennsdp)
      .input("matinh", req.body.matinh)
      .input("tentinh", req.body.tentinh)
      .input("maquanhuyen", req.body.maquanhuyen)
      .input("tenquanhuyen", req.body.tenquanhuyen)
      .input("maxaphuong", req.body.maxaphuong)
      .input("tenxaphuong", req.body.tenxaphuong)
      .input("benhvientinh", req.body.benhvientinh)
      .input("mabenhvien", req.body.mabenhvien)
      .input("tenbenhvien", req.body.tenbenhvien)
      .input("muchuongbhyt", req.body.muchuongbhyt)
      .input("tothon", req.body.tothon)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("updatedAt", req.body.updatedAt)
      .input("updatedBy", req.body.updatedBy).query(`
                  INSERT INTO kekhai (matochuc, tentochuc, madaily, tendaily, maloaihinh, tenloaihinh, hoten, masobhxh, cccd, dienthoai,	
                    maphuongan, tenphuongan, ngaysinh, gioitinh, nguoithu, tienluongcs, sotien,	
                    tylengansachdiaphuong, hotrokhac, tungay, heso, tyledong, muctiendong,	
                    maphuongthucdong, tenphuongthucdong, sothang, tuthang, tientunguyendong, tienlai, madoituong,	
                    tendoiduong, tylensnnht, tiennsnnht, tylensdp, tiennsdp, matinh, tentinh, maquanhuyen, tenquanhuyen,	
                    maxaphuong, tenxaphuong, benhvientinh, mabenhvien, tenbenhvien, muchuongbhyt, tothon, ghichu,	
                    createdAt, createdBy, updatedAt, updatedBy) 
                  VALUES (@matochuc, @tentochuc, @madaily, @tendaily, @maloaihinh, @tenloaihinh, @hoten, @masobhxh, @cccd, @dienthoai,	
                    @maphuongan, @tenphuongan, @ngaysinh, @gioitinh, @nguoithu, @tienluongcs, @sotien,	
                    @tylengansachdiaphuong, @hotrokhac, @tungay, @heso, @tyledong, @muctiendong,	
                    @maphuongthucdong, @tenphuongthucdong, @sothang, @tuthang, @tientunguyendong, @tienlai, @madoituong,	
                    @tendoiduong, @tylensnnht, @tiennsnnht, @tylensdp, @tiennsdp, @matinh, @tentinh, @maquanhuyen, @tenquanhuyen,	
                    @maxaphuong, @tenxaphuong, @benhvientinh, @mabenhvien, @tenbenhvien, @muchuongbhyt, @tothon, @ghichu,	
                    @createdAt, @createdBy, @updatedAt, @updatedBy);
              `);
    const kekhai = req.body;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});


// tạo kê khai mới
router.post("/add-kekhai-transaction", async (req, res) => {
  let transaction = null; // Để kiểm soát giao dịch nếu xảy ra lỗi

  try {
    // Đảm bảo kết nối trước khi bắt đầu giao dịch
    await pool.connect();

    // Bắt đầu một giao dịch
    transaction = new sql.Transaction(pool);

    await transaction.begin(); // Bắt đầu giao dịch

    const request = new sql.Request(transaction);

    // Tạo số hồ sơ duy nhất
    const maxSoHoSoResult = await request.query(
      "SELECT MAX(sohoso) as max_so_ho_so FROM kekhai"
    );
    const newSoHoSo =
      (maxSoHoSoResult.recordset[0].max_so_ho_so || 0) + 1;

    // Chèn tất cả các mục với cùng số hồ sơ
    const insertQuery = `
      INSERT INTO kekhai (
        sohoso, matochuc, tentochuc, madaily, tendaily, maloaihinh, tenloaihinh, hoten, masobhxh, cccd, dienthoai,	
        maphuongan, tenphuongan, ngaysinh, gioitinh, nguoithu, tienluongcs, sotien,	
        tylengansachdiaphuong, hotrokhac, tungay, heso, tyledong, muctiendong,	
        maphuongthucdong, tenphuongthucdong, sothang, tuthang, tientunguyendong, tienlai, madoituong,	
        tendoiduong, tylensnnht, tiennsnnht, tylensdp, tiennsdp, matinh, tentinh, maquanhuyen, tenquanhuyen,	
        maxaphuong, tenxaphuong, benhvientinh, mabenhvien, tenbenhvien, tothon, ghichu,	
        createdAt, createdBy, updatedAt, updatedBy, dotkekhai, kykekhai, ngaykekhai, trangthai
      ) VALUES 
    `;

    const values = req.body.items
      .map((item) => {
        return `(
          ${newSoHoSo},
          '${item.matochuc}',
          '${item.tentochuc}',
          '${item.madaily}',
          '${item.tendaily}',
          '${item.maloaihinh}',
          '${item.tenloaihinh}',
          '${item.hoten}',
          '${item.masobhxh}',
          '${item.cccd}',
          '${item.dienthoai}',
          '${item.maphuongan}',
          '${item.tenphuongan}',
          '${item.ngaysinh}',
          '${item.gioitinh}',
          '${item.nguoithu}',
          '${item.tienluongcs}',
          '${item.sotien}',
          '${item.tylengansachdiaphuong}',
          '${item.hotrokhac}',
          '${item.tungay}',
          '${item.heso}',
          '${item.tyledong}',
          '${item.muctiendong}',
          '${item.maphuongthucdong}',
          '${item.tenphuongthucdong}',
          '${item.sothang}',
          '${item.tuthang}',
          '${item.tientunguyendong}',
          '${item.tienlai}',
          '${item.madoituong}',
          '${item.tendoiduong}',
          '${item.tylensnnht}',
          '${item.tiennsnnht}',
          '${item.tylensdp}',
          '${item.tiennsdp}',
          '${item.matinh}',
          '${item.tentinh}',
          '${item.maquanhuyen}',
          '${item.tenquanhuyen}',
          '${item.maxaphuong}',
          '${item.tenxaphuong}',
          '${item.benhvientinh}',
          '${item.mabenhvien}',
          '${item.tenbenhvien}',
          '${item.tothon}',
          '${item.ghichu}',
          '${item.createdAt}',
          '${item.createdBy}',
          '${item.updatedAt}',
          '${item.updatedBy}',
          '${item.dotkekhai}',
          '${item.kykekhai}',
          '${item.ngaykekhai}',
          '${item.trangthai}'

        )`;
      })
      .join(",");

    // Thực hiện truy vấn chèn
    await request.query(insertQuery + values);

    // Xác nhận giao dịch
    await transaction.commit();

    res.json({ success: true, sohoso: newSoHoSo });
  } catch (error) {
    // Nếu có lỗi, hoàn tác giao dịch
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({ error: error.message });
  } finally {
    // Đóng kết nối
    if (pool.connected) {
      await pool.close();
    }
  }
});

// danh sách kê khai all
router.get("/all-ds-kekhai", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query(`SELECT * FROM kekhai`);
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all danh sách kê khai with loại hình
router.get("/getalldskkwithmalh", async (req, res) => {
  // console.log(req.query.maloaihinh);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maloaihinh", req.query.maloaihinh)
      .query(`SELECT * FROM kekhai where maloaihinh=@maloaihinh`);
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all danh sách kê khai with loại hình with madaily
router.get("/getalldskkwithmalh", async (req, res) => {
  // console.log(req.query.maloaihinh);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maloaihinh", req.query.maloaihinh)
      .input("madaily", req.query.madaily)
      .query(`SELECT * FROM kekhai where maloaihinh=@maloaihinh and madaily=@madaily`);
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// all danh sách kê khai with loại hình with madaily
router.get("/getallkekhaiwithuser", async (req, res) => {
  // console.log(req.query.maloaihinh);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maloaihinh", req.query.maloaihinh)
      .input("madaily", req.query.madaily)
      .query(`SELECT * FROM kekhai where madaily=@madaily and maloaihinh=@maloaihinh`);
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// tìm hồ sơ theo từ ngày đến ngày - đối với ar và bi
router.get("/hskekhaifromtotungay", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("maloaihinh", req.query.maloaihinh)
      .input("madaily", req.query.madaily)
      .input("tungay", req.query.tungay)
      .input("denngay", req.query.denngay)
      .query(`select * from kekhai where maloaihinh=@maloaihinh and madaily=@madaily and tungay between @tungay and @denngay`);
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
