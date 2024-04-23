const express = require("express");
const router = express.Router();
const { pool } = require("../database/dbinfo");
const { Table, NVarChar, Int, Float, Transaction, Bit, Date, DateTime } = require("mssql");

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

router.post("/kekhai-trans", async (req, res) => {
  // console.log(req.body);
  let transaction = null;
  const data = req.body;

  const table = new Table("kekhai");
  table.create = false;

  table.columns.add("sohoso", NVarChar, { nullable: true });
  table.columns.add("matochuc", NVarChar, { nullable: true });
  table.columns.add("tentochuc", NVarChar, { nullable: true });
  table.columns.add("madaily", NVarChar, { nullable: true });
  table.columns.add("tendaily", NVarChar, { nullable: true });
  table.columns.add("maloaihinh", NVarChar, { nullable: true });
  table.columns.add("tenloaihinh", NVarChar, { nullable: true });

  table.columns.add("masobhxh", NVarChar, { nullable: true });
  table.columns.add("hoten", NVarChar, { nullable: true });
  table.columns.add("ngaysinh", Date, { nullable: true });
  table.columns.add("gioitinh", Bit, { nullable: true });
  table.columns.add("cccd", NVarChar, { nullable: true });
  table.columns.add("dienthoai", NVarChar, { nullable: true });

  table.columns.add("maphuongan", NVarChar, { nullable: true });
  table.columns.add("tenphuongan", NVarChar, { nullable: true });
  table.columns.add("nguoithu", Int, { nullable: true });
  table.columns.add("tienluongcs", Float, { nullable: true });
  table.columns.add("sotien", Float, { nullable: true });

  table.columns.add("tylengansachdiaphuong", Int, { nullable: true });
  table.columns.add("hotrokhac", Int, { nullable: true });
  table.columns.add("tungay", Date, { nullable: true });
  table.columns.add("tyledong", Int, { nullable: true });
  table.columns.add("muctiendong", Float, { nullable: true });
  table.columns.add("maphuongthucdong", NVarChar, { nullable: true });
  table.columns.add("tenphuongthucdong", NVarChar, { nullable: true });

  table.columns.add("sothang", Int, { nullable: true });
  table.columns.add("tuthang", Date, { nullable: true });
  table.columns.add("tientunguyendong", Float, { nullable: true });
  table.columns.add("tienlai", Float, { nullable: true });
  table.columns.add("madoituong", NVarChar, { nullable: true });
  table.columns.add("tendoituong", NVarChar, { nullable: true });
  table.columns.add("tylensnnht", Int, { nullable: true });
  table.columns.add("tiennsnnht", Float, { nullable: true });
  table.columns.add("tylensdp", Int, { nullable: true });
  table.columns.add("tiennsdp", NVarChar, { nullable: true });

  table.columns.add("matinh", NVarChar, { nullable: true });
  table.columns.add("tentinh", NVarChar, { nullable: true });
  table.columns.add("maquanhuyen", NVarChar, { nullable: true });
  table.columns.add("tenquanhuyen", NVarChar, { nullable: true });
  table.columns.add("maxaphuong", NVarChar, { nullable: true });
  table.columns.add("tenxaphuong", NVarChar, { nullable: true });
  table.columns.add("tothon", NVarChar, { nullable: true });
  table.columns.add("benhvientinh", NVarChar, { nullable: true });
  table.columns.add("mabenhvien", NVarChar, { nullable: true });
  table.columns.add("tenbenhvien", NVarChar, { nullable: true });
  table.columns.add("ghichu", NVarChar, { nullable: true });

  table.columns.add("createdAt", NVarChar, { nullable: true });
  table.columns.add("createdBy", NVarChar, { nullable: true });
  table.columns.add("updatedAt", NVarChar, { nullable: true });
  table.columns.add("updatedBy", NVarChar, { nullable: true });

  table.columns.add("dotkekhai", NVarChar, { nullable: true });
  table.columns.add("kykekhai", NVarChar, { nullable: true });
  table.columns.add("ngaykekhai", DateTime, { nullable: true });
  table.columns.add("trangthai", Bit, { nullable: true });

  // Tạo số hồ sơ duy nhất
  const maxSoHoSoResult = await pool.request().query(
    "SELECT MAX(sohoso) as max_so_ho_so FROM kekhai"
  );
  const newSoHoSo =
    (maxSoHoSoResult.recordset[0].max_so_ho_so || 0) + 1;


  // for (let j = 0; j < data.length; j += 1) {
  //   table.rows.add(
  //     data[j].sohoso,
  //     data[j].matochuc,
  //     data[j].tentochuc,
  //     data[j].madaily,
  //     data[j].tendaily,
  //     data[j].masobhxh
  //   );
  // }

  data.forEach((item) => {
    console.log(item.tienluongcs);
    console.log(item.sotien);
    console.log(item.tylengansachdiaphuong);
    console.log(item.hotrokhac);
    console.log(item.tungay);
    console.log(item.tyledong);
    console.log(item.muctiendong);
    console.log(item.maphuongthucdong);
    console.log(item.tenphuongthucdong);

    console.log(item.sothang);
    console.log(item.tuthang);
    console.log(item.tientunguyendong);
    console.log(item.tienlai);
    console.log(item.madoituong);
    console.log(item.tendoituong); 
    
    console.log(item.tylensnnht);
    console.log(item.tiennsnnht);
    console.log(item.tylensdp);


    console.log(item.matinh);
    console.log(item.tentinh);
    console.log(item.maquanhuyen);
    console.log(item.tenquanhuyen);
    console.log(item.maxaphuong);
    console.log(item.tenxaphuong);
    console.log(item.tothon);

    console.log(item.benhvientinh);
    console.log(item.mabenhvien);
    console.log(item.tenbenhvien);
    console.log(item.ghichu);

    console.log(item.createdAt);
    console.log(item.createdBy);
    console.log(item.updatedAt);
    console.log(item.updatedBy);

    console.log(item.dotkekhai);
    console.log(item.kykekhai);
    console.log(item.ngaykekhai);
    console.log(item.trangthai);

    table.rows.add(
      newSoHoSo,
      item.matochuc,
      item.tentochuc,
      item.madaily,
      item.tendaily,
      item.maloaihinh,
      item.tenloaihinh,

      item.masobhxh,
      item.hoten,
      item.ngaysinh,
      item.gioitinh,
      item.cccd,
      item.dienthoai,

      item.maphuongan,
      item.tenphuongan,
      item.nguoithu,
      item.tienluongcs,
      item.sotien,

      item.tylengansachdiaphuong,
      item.hotrokhac,
      // item.tungay,
      item.tyledong,
      item.muctiendong,
      item.maphuongthucdong,
      item.tenphuongthucdong,

      // item.sothang,
      // item.tuthang,
      // item.tientunguyendong,
      // item.tienlai,
      // item.madoituong,
      // item.tendoituong,
      // item.tylensnnht,
      // item.tiennsnnht,
      // item.tylensdp,
      // item.tiennsdp,

      item.matinh,
      item.tentinh,
      item.maquanhuyen,
      item.tenquanhuyen,
      // item.maxaphuong,
      // item.tenxaphuong,
      // item.tothon,
      // item.benhvientinh,
      // item.mabenhvien,
      // item.tenbenhvien,
      // item.ghichu,

      // item.createdAt,
      // item.createdBy,
      // item.updatedAt,
      // item.updatedBy,

      // item.dotkekhai,
      // item.kykekhai,
      // item.ngaykekhai,
      // item.trangthai,
    );
  });

  // console.log(table);

  try {
    // bắt đầu kết nối
    await pool.connect();

    // Bắt đầu giao dịch
    transaction = new Transaction(pool);
    await transaction.begin();

    // Chèn dữ liệu sử dụng giao dịch
    const request = transaction.request();
    const results = await request.bulk(table);
    // const results = await pool.request().bulk(table);

    // Commit giao dịch nếu không có lỗi
    await transaction.commit();

    console.log(`rows affected ${results.rowsAffected}`);
    console.log(results);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    // Nếu có lỗi, hoàn tác giao dịch
    if (transaction) {
      await transaction.rollback(); // Hoàn tác giao dịch
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
