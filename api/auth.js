const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database/dbinfo");
const jwt = require("jsonwebtoken");
const verifyToken = require("../services/verify-token");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /* Nhớ sửa đường dẫn khi deploy lên máy chủ */
    // đường dẫn cho máy home
    // cb(null, "D:\\CODE\\TCDVTHU\\client\\static\\avatar");
    // đường dẫn máy cơ quan
    // cb(null, "D:\\PROJECT\\TCDVTHU\\client\\static\\avatar");
    // đường dẫn khi deploy máy chủ
    cb(null, "C:\\TCDVTHU\\client\\static\\avatar");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

/* Login user auth */
router.post("/access/login", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("username", username)
      .query(`SELECT * FROM users WHERE username = @username`);
    const user = result.recordset[0];
    if (!user) {
      res.status(403).json({
        success: 9,
        message: "Authenticate failed, not found user",
      });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        if (user.active !== true) {
          res.status(403).json({
            success: 4,
            message: "Authenticate failed, not active user",
          });
        } else {
          let token = jwt.sign(user, process.env.SECRET, { expiresIn: "12h" });
          res.json({ success: 8, user, token });
          //console.log(user);
        }
      } else {
        res.status(403).json({
          success: 7,
          message: "Authenticate failed, wrong password",
        });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/callresetpass", upload.single("avatar"), async (req, res) => {
  // console.log(req.body);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("email", req.body.email)
      .query(
        `SELECT email, cccd, masobhxh FROM users where active=1 and email=@email`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({
        isValid: false,
        message: "Email không tồn tại hoặc chưa được kích hoạt",
      });
    }

    const user = result.recordset[0];
    console.log(user);

    // check CCCD và masobhxh
    if (user.cccd !== req.body.cccd || user.masobhxh !== req.body.masobhxh) {
      // CCCD hoặc masobhxh không khớp
      return res.status(400).json({
        message: "CCCD hoặc Mã số BHXH không đúng thông tin đã đăng ký",
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Tạo user auth kèm token */
// router.post("/account", upload.single("avatar"), async (req, res) => {
//   // console.log(req.body);
//   var password = req.body.password;
//   const encryptedPassword = await bcrypt.hash(password, 10);

//   let linkAvatar;
//   const file = req.file;
//   if (!file) {
//     linkAvatar = req.body.avatar;
//   } else {
//     // Đổi đường dẫn khi deploy lên máy chủ
//     linkAvatar = `http://ansinhbhxh.online/avatar/${req.file.filename}`;
//   }
//   try {
//     await pool.connect();
//     const result = await pool
//       .request()
//       .input("matochuc", req.body.matochuc)
//       .input("tentochuc", req.body.tentochuc)
//       .input("matinh", req.body.matinh)
//       .input("tentinh", req.body.tentinh)
//       .input("mahuyen", req.body.mahuyen)
//       .input("tenhuyen", req.body.tenhuyen)
//       .input("maxa", req.body.maxa)
//       .input("tenxa", req.body.tenxa)
//       .input("madaily", req.body.madaily)
//       .input("tendaily", req.body.tendaily)
//       .input("diachi", req.body.diachi)
//       .input("cccd", req.body.cccd)
//       .input("sodienthoai", req.body.sodienthoai)
//       .input("email", req.body.email)
//       .input("username", req.body.username)
//       .input("name", req.body.name)
//       .input("password", encryptedPassword)
//       .input("role", req.body.role)
//       .input("avatar", linkAvatar)
//       .input("active", req.body.active)
//       .input("createdBy", req.body.createdBy)
//       .input("createdAt", req.body.createdAt)
//       .input("updatedBy", req.body.updatedBy)
//       .input("updatedAt", req.body.updatedAt).query(`
//                 INSERT INTO users (matochuc, tentochuc, matinh, tentinh, mahuyen, tenhuyen, maxa, tenxa, madaily, tendaily,
//                   diachi, cccd, sodienthoai, email, username, name, password, role, avatar, active,
//                   createdBy, createdAt, updatedBy, updatedAt)
//                 VALUES (@matochuc, @tentochuc, @matinh, @tentinh, @mahuyen, @tenhuyen, @maxa, @tenxa, @madaily, @tendaily,
//                   @diachi, @cccd, @sodienthoai, @email, @username, @name, @password, @role, @avatar, @active,
//                   @createdBy, @createdAt, @updatedBy, @updatedAt);
//             `);
//     const user = req.body;
//     let token = jwt.sign({ user }, process.env.SECRET, { expiresIn: "12h" });
//     res.json({ user, token, message: "Create user success!", success: true });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
