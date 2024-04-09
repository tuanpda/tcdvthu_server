const bodyParse = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require("morgan");
const verifyToken = require('./services/verify-token');

const app = express();
dotenv.config();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

app.use('/api/auth', require('./api/auth'));

// Middleware xác thực chỉ áp dụng cho các endpoint cần được bảo vệ
app.use(['/', '/api/users', '/api/danhmucs' ], verifyToken);

app.get('/', (req, res) => {
    res.send('<h1>🤖 API SQLSERVER from NODEJS - TEST</h1>');
});


app.use('/api/users', require('./api/users'));
app.use('/api/danhmucs', require('./api/danhmucs'));
// app.use('/api/nodemailer', require('./api/nodemailer'));
app.use('/api/kekhai', require('./api/kekhai'));
app.use('/api/tochucdvt', require('./api/tochucdvt'));

app.listen(process.env.PORT, () => {
    console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
});
