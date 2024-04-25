const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");
const {
  Table,
  NVarChar,
  Int,
  Float,
  Transaction,
  Bit,
  Date,
  DateTime,
} = require("mssql");

// add ke khai chạy lẻ từng dòng
router.post("/add-kekhai", async (req, res) => {
  // console.log(req.body);
  try {
    await pool.connect();
    // Tạo số hồ sơ duy nhất
    const maxSoHoSoResult = await pool
      .request()
      .query("SELECT MAX(_id) as max_so_ho_so FROM kekhai");
    const newSoHoSo = (maxSoHoSoResult.recordset[0].max_so_ho_so || 0) + 1;
    const soHoso =
      newSoHoSo + "/" + req.body.nvt_masobhxh + "/" + req.body.nvt_cccd;
    // console.log(soHoso);

    const result = await pool
      .request()
      .input("sohoso", soHoso)
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
      .input("tyledong", req.body.tyledong)
      .input("muctiendong", req.body.muctiendong)
      .input("maphuongthucdong", req.body.maphuongthucdong)
      .input("tenphuongthucdong", req.body.tenphuongthucdong)
      .input("tuthang", req.body.tuthang)
      .input("tientunguyendong", req.body.tientunguyendong)
      .input("tienlai", req.body.tienlai)
      .input("madoituong", req.body.madoituong)
      .input("tendoituong", req.body.tendoituong)
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
      .input("tothon", req.body.tothon)
      .input("ghichu", req.body.ghichu)
      .input("createdAt", req.body.createdAt)
      .input("createdBy", req.body.createdBy)
      .input("updatedAt", req.body.updatedAt)
      .input("updatedBy", req.body.updatedBy)
      .input("dotkekhai", newSoHoSo)
      .input("kykekhai", req.body.kykekhai)
      .input("ngaykekhai", req.body.ngaykekhai)
      .input("trangthai", req.body.trangthai).query(`
                  INSERT INTO kekhai (sohoso, matochuc, tentochuc, madaily, tendaily, maloaihinh, tenloaihinh, hoten, masobhxh, cccd, dienthoai,	
                    maphuongan, tenphuongan, ngaysinh, gioitinh, nguoithu, tienluongcs, sotien,	
                    tylengansachdiaphuong, hotrokhac, tungay, tyledong, muctiendong,	
                    maphuongthucdong, tenphuongthucdong, tuthang, tientunguyendong, tienlai, madoituong,	
                    tendoituong, tylensnnht, tiennsnnht, tylensdp, tiennsdp, matinh, tentinh, maquanhuyen, tenquanhuyen,	
                    maxaphuong, tenxaphuong, benhvientinh, mabenhvien, tenbenhvien, tothon, ghichu,	
                    createdAt, createdBy, updatedAt, updatedBy, dotkekhai, kykekhai, ngaykekhai, trangthai) 
                  VALUES (@sohoso, @matochuc, @tentochuc, @madaily, @tendaily, @maloaihinh, @tenloaihinh, @hoten, @masobhxh, @cccd, @dienthoai,	
                    @maphuongan, @tenphuongan, @ngaysinh, @gioitinh, @nguoithu, @tienluongcs, @sotien,	
                    @tylengansachdiaphuong, @hotrokhac, @tungay, @tyledong, @muctiendong,	
                    @maphuongthucdong, @tenphuongthucdong, @tuthang, @tientunguyendong, @tienlai, @madoituong,	
                    @tendoituong, @tylensnnht, @tiennsnnht, @tylensdp, @tiennsdp, @matinh, @tentinh, @maquanhuyen, @tenquanhuyen,	
                    @maxaphuong, @tenxaphuong, @benhvientinh, @mabenhvien, @tenbenhvien, @tothon, @ghichu,	
                    @createdAt, @createdBy, @updatedAt, @updatedBy, @dotkekhai, @kykekhai, @ngaykekhai, @trangthai);
              `);
    const kekhai = req.body;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

// add ke khai chạy theo bộ
router.post("/add-kekhai-series", async (req, res) => {
  // console.log(req.body);
  let dataKekhai = req.body;
  // console.log(dataKekhai);
  let transaction = null;
  // Tạo mảng để lưu thông tin cần trả lại sau khi thành công
  const listSuccess = [];

  try {
    // bắt đầu kết nối
    await pool.connect();
    // Bắt đầu giao dịch
    transaction = new Transaction(pool);
    await transaction.begin();

    // Lấy số hồ sơ lớn nhất hiện tại để tạo số hồ sơ duy nhất
    const maxSoHoSoResult = await pool
      .request()
      .query("SELECT MAX(_id) as max_so_ho_so FROM kekhai");
    let maxSohoso = (maxSoHoSoResult.recordset[0].max_so_ho_so || 0);
    let getNumerDotkekhai = maxSohoso
    // const soHoso = newSoHoSo + "/" + item.nvt_masobhxh + "/" + item.nvt_cccd;

    for (const item of dataKekhai) {
      const soKyDotKeKhai = getNumerDotkekhai
      // Tạo số hồ sơ mới
      const newSoHoSo = maxSohoso + 1;
      maxSohoso++; // Tăng giá trị cho lần tiếp theo

      const soHoso = `${newSoHoSo}/${item.nvt_masobhxh}/${item.nvt_cccd}`;

      const result = await transaction
        .request()
        .input("sohoso", soHoso)
        .input("matochuc", item.matochuc)
        .input("tentochuc", item.tentochuc)
        .input("madaily", item.madaily)
        .input("tendaily", item.tendaily)
        .input("maloaihinh", item.maloaihinh)
        .input("tenloaihinh", item.tenloaihinh)
        .input("hoten", item.hoten)
        .input("masobhxh", item.masobhxh)
        .input("cccd", item.cccd)
        .input("dienthoai", item.dienthoai)
        .input("maphuongan", item.maphuongan)
        .input("tenphuongan", item.tenphuongan)
        .input("ngaysinh", item.ngaysinh)
        .input("gioitinh", item.gioitinh)
        .input("nguoithu", item.nguoithu)
        .input("tienluongcs", item.tienluongcs)
        .input("sotien", item.sotien)
        .input("tylengansachdiaphuong", item.tylengansachdiaphuong)
        .input("hotrokhac", item.hotrokhac)
        .input("tungay", item.tungay)
        .input("tyledong", item.tyledong)
        .input("muctiendong", item.muctiendong)
        .input("maphuongthucdong", item.maphuongthucdong)
        .input("tenphuongthucdong", item.tenphuongthucdong)
        .input("tuthang", item.tuthang)
        .input("tientunguyendong", item.tientunguyendong)
        .input("tienlai", item.tienlai)
        .input("madoituong", item.madoituong)
        .input("tendoituong", item.tendoituong)
        .input("tylensnnht", item.tylensnnht)
        .input("tiennsnnht", item.tiennsnnht)
        .input("tylensdp", item.tylensdp)
        .input("tiennsdp", item.tiennsdp)
        .input("matinh", item.matinh)
        .input("tentinh", item.tentinh)
        .input("maquanhuyen", item.maquanhuyen)
        .input("tenquanhuyen", item.tenquanhuyen)
        .input("maxaphuong", item.maxaphuong)
        .input("tenxaphuong", item.tenxaphuong)
        .input("benhvientinh", item.benhvientinh)
        .input("mabenhvien", item.mabenhvien)
        .input("tenbenhvien", item.tenbenhvien)
        .input("tothon", item.tothon)
        .input("ghichu", item.ghichu)
        .input("createdAt", item.createdAt)
        .input("createdBy", item.createdBy)
        .input("updatedAt", item.updatedAt)
        .input("updatedBy", item.updatedBy)
        .input("dotkekhai", soKyDotKeKhai)
        .input("kykekhai", item.kykekhai)
        .input("ngaykekhai", item.ngaykekhai)
        .input("trangthai", item.trangthai).query(`
                  INSERT INTO kekhai (sohoso, matochuc, tentochuc, madaily, tendaily, maloaihinh, tenloaihinh, hoten, masobhxh, cccd, dienthoai,	
                    maphuongan, tenphuongan, ngaysinh, gioitinh, nguoithu, tienluongcs, sotien,	
                    tylengansachdiaphuong, hotrokhac, tungay, tyledong, muctiendong,	
                    maphuongthucdong, tenphuongthucdong, tuthang, tientunguyendong, tienlai, madoituong,	
                    tendoituong, tylensnnht, tiennsnnht, tylensdp, tiennsdp, matinh, tentinh, maquanhuyen, tenquanhuyen,	
                    maxaphuong, tenxaphuong, benhvientinh, mabenhvien, tenbenhvien, tothon, ghichu,	
                    createdAt, createdBy, updatedAt, updatedBy, dotkekhai, kykekhai, ngaykekhai, trangthai) 
                  VALUES (@sohoso, @matochuc, @tentochuc, @madaily, @tendaily, @maloaihinh, @tenloaihinh, @hoten, @masobhxh, @cccd, @dienthoai,	
                    @maphuongan, @tenphuongan, @ngaysinh, @gioitinh, @nguoithu, @tienluongcs, @sotien,	
                    @tylengansachdiaphuong, @hotrokhac, @tungay, @tyledong, @muctiendong,	
                    @maphuongthucdong, @tenphuongthucdong, @tuthang, @tientunguyendong, @tienlai, @madoituong,	
                    @tendoituong, @tylensnnht, @tiennsnnht, @tylensdp, @tiennsdp, @matinh, @tentinh, @maquanhuyen, @tenquanhuyen,	
                    @maxaphuong, @tenxaphuong, @benhvientinh, @mabenhvien, @tenbenhvien, @tothon, @ghichu,	
                    @createdAt, @createdBy, @updatedAt, @updatedBy, @dotkekhai, @kykekhai, @ngaykekhai, @trangthai);
              `);

      // Lưu thông tin cần thiết vào danh sách
      listSuccess.push({
        sohoso: soHoso,
        dotkekhai: soKyDotKeKhai,
        kykekhai: item.kykekhai,
        ngaykekhai: item.ngaykekhai,
        trangthai: item.trangthai,
        hoten: item.hoten,
        masobhxh: item.masobhxh,
        cccd: item.cccd,
        dienthoai: item.dienthoai,
      });
    }

    // Nếu thành công, hoàn thành giao dịch
    await transaction.commit();
    res.json({
      success: true,
      message: "Data inserted successfully",
      data: listSuccess,
    });
  } catch (error) {
    // Nếu có lỗi, hoàn tác giao dịch
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).json({
      status: "error",
      error: error.message,
    });
  } finally {
    if (pool.connected) {
      await pool.close(); // Đóng kết nối
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
      .query(
        `SELECT * FROM kekhai where maloaihinh=@maloaihinh and madaily=@madaily`
      );
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
      .query(
        `SELECT * FROM kekhai where madaily=@madaily and maloaihinh=@maloaihinh`
      );
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
      .query(
        `select * from kekhai where maloaihinh=@maloaihinh and madaily=@madaily and tungay between @tungay and @denngay`
      );
    const kekhai = result.recordset;
    res.json(kekhai);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
