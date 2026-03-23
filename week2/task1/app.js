const express = require('express');
const myspl = require('mysql2/promise');
const app = express();
const PORT = 5000;
require('dotenv').config();

const poolConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_POOL_LIMIT) || 10,
    queueLimit: 0, 
};
const pool = myspl.createPool(poolConfig);

// 中间件
// 挂载静态资源
app.use(express.static('public'));

// 处理逻辑
app.get('/',async (req,res)=>{
    // 页面刷新获取事项
    const rows = await pool.query('select * from things');
    res.send(JSON.stringify(rows));
    // 页面发送请求
    const waitModify = await req.body.JSON();
});

// 监听
app.listen(PORT,()=>{
    console.log('ok');
});