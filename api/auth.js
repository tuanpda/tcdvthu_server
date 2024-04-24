const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database/dbinfo");
const jwt = require("jsonwebtoken");
const verifyToken = require("../services/verify-token");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
// import { OAuth2Client } from 'google-auth-library'
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID;
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET;
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN;
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS;

// Khởi tạo OAuth2Client với Client ID và Client Secret
const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});

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
  let email = req.body.email;
  let cccd = req.body.cccd;
  let masobhxh = req.body.masobh;
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("email", email)
      .query(
        `SELECT email, cccd, masobhxh FROM users where active=1 and email=@email and role<>1`
      );

    if (result.recordset.length === 0) {
      res.status(404).json({
        message: "Email không tồn tại hoặc chưa được kích hoạt",
      });
      return;
    }

    const user = result.recordset[0];
    // console.log(user);

    // check CCCD và masobhxh
    if (user.cccd !== cccd || user.masobhxh !== masobhxh) {
      // CCCD hoặc masobhxh không khớp
      res.status(400).json({
        message: "CCCD hoặc Mã số BHXH không đúng thông tin đã đăng ký",
      });
      return;
    }

    if (user.cccd === cccd && user.masobhxh === masobhxh) {
      // Thông tin khớp, gửi mật khẩu mới
      const newPass = Math.random().toString(36).slice(-8); // Tạo mật khẩu ngẫu nhiên
      const hashedPass = await bcrypt.hash(newPass, 10);

      await pool
        .request()
        .input("email", email)
        .input("password", hashedPass)
        .query(`UPDATE users SET password = @password WHERE email = @email`);

      // gửi thư mật khẩu đến cho người dùng

      const subject = `Email Reset mật khẩu từ hệ thống phần mềm ansinhbhxh.online`;
      const content = `
      <p>Xin chào bạn!</p>
      <p>Chúng tôi đã nhận được yêu cầu Reset Mật khẩu từ bạn hoặc cá nhân tổ chức nào đó lấy thông tin email của bạn để thực hiện (nếu trường hợp không phải là bạn thì bạn hãy bỏ qua email này gửi email phản hồi lại cho chúng tôi thông qua email sonthucompany@gmail.com)</p>
      <hr />
      <p>Bạn đã thực hiện thành công yêu cầu Reset mật khẩu. Mật khẩu mới của bạn là:</p>
      <ul>
        <li>Mật khẩu mới: ${newPass}</li>
        <li>Đây là mật khẩu đăng nhập vào phần mềm, tuyệt đối không tiết lộ hay chia sẽ cho bất kỳ ai</li>
      </ul>
      <hr />
      <p>* CHÚC BẠN CÓ NHỮNG TRẢI NGHIỆM TỐT NHẤT KHI SỬ DỤNG HỆ THỐNG PHẦN MỀM CỦA CÔNG TY CHÚNG TÔI *</p>
      <p>* CÔNG VIỆC CỦA BẠN - SỨ MỆNH CỦA CHÚNG TÔI *</p>
    `;
      if (!email || !subject || !content)
        throw new Error("Please provide email, subject and content!");
      /**
       * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
       * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
       */
      // console.log('start access');
      // console.log(myOAuth2Client);
      const myAccessTokenObject = await myOAuth2Client.getAccessToken();
      // console.log(myAccessTokenObject);
      // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
      const myAccessToken = myAccessTokenObject?.token;
      // console.log(myAccessToken);
      // // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: ADMIN_EMAIL_ADDRESS,
          clientId: GOOGLE_MAILER_CLIENT_ID,
          clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
          refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken,
        },
      });
      // mailOption là những thông tin gửi từ phía client lên thông qua API
      const mailOptions = {
        to: email, // Gửi đến ai?
        subject: subject, // Tiêu đề email
        html: `<h3>${content}</h3>`, // Nội dung email
      };
      // Gọi hành động gửi email
      await transport.sendMail(mailOptions);
      // Không có lỗi gì thì trả về success
      res.status(200).json({ message: "Email sent successfully." });

    }
  } catch (error) {
    res.status(500).json(error);
  }
});

/* Get email */
router.get("/findemail", async (req, res) => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("email", req.query.email)
      .query(`SELECT * FROM users WHERE email = @email`);
    const email = result.recordset;
    res.json(email);
  } catch (error) {
    res.status(500).json(error);
  }
});

// kích hoạt user with email
router.post("/active/user", async (req, res) => {
  // console.log(req.body);
  try {
    await pool.connect();
    const result = await pool
      .request()
      .input("email", req.body.email)
      .query(`SELECT * FROM users WHERE email = @email`);
    const user = result.recordset[0];
    // console.log(user);
    if (user) {
      await pool
        .request()
        .input("email", user.email)
        .query(
          `UPDATE users SET
                  active = 1
              WHERE email = @email;`
        );
    }
    res.json({
      success: true,
      message: "actived success !",
    });
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
