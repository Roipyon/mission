const express = require('express');
const myspl = require('mysql2/promise');
const app = express();
const PORT = 5000;
const HOST = '0.0.0.0';
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
// 解析请求体
app.use(express.json());

// 处理逻辑
app.get('/get/things',async (req,res)=>{
    // 页面刷新获取事项
    const rows = await pool.query('select * from things');
    if (!rows[0].length) res.json({success: false,message: '待办事项为空！'});
    else res.json(rows[0]);
});
app.post('/',async(req,res)=>{
    // 处理提交表单
    const waitModify = req.body;
    if (waitModify.event === "create")
    {
        const rows = await pool.query('insert into things (title,status) values (?,?)',[waitModify.title,waitModify.status]);
        if (rows[0].affectedRows === 1) res.json({success: true,message: ''});
        else res.json({success: false, message: '事件创建失败！'});
    }
    else if (waitModify.event === 'modify')
    {
        const now = new Date().toLocaleString('sv-SE',{timeZone: 'Asia/Shanghai'}).replace('T',' ').slice(0,19);
        if (now <= waitModify.deadline)
        {
            const rows = await pool.query('update things set title=?,level=?,class=?,deadline=? where id=?',[waitModify.title,waitModify.level,waitModify.kind,waitModify.deadline,waitModify.id]);
            if (rows[0].affectedRows === 1) res.json({success: true,message: ''});
            else res.json({success: false, message: '事件修改失败！'});
        }
        else res.json({success: false,message: '截止时间不允许在此刻之前！'});
        
    }
    else if (waitModify.event === 'delete')
    {
        const rows = await pool.query('update things set status=? where id=?',['did',waitModify.id]);
        if (rows[0].affectedRows === 1) res.json({success: true,message: ''});
        else res.json({success: false, message: '事件完成失败！'});
    }
    else if (waitModify.event === 'recover')
    {
        const rows = await pool.query('update things set status=? where id=?',['do',waitModify.id]);
        if (rows[0].affectedRows === 1) res.json({success: true,message: ''});
        else res.json({success: false, message: '事件恢复失败！'});
    }
    else if (waitModify.event === 'remove')
    {
        const rows = await pool.query('delete from things');
        if (rows[0].affectedRows >= 1) res.json({success: true,message: ''});
        else res.json({success: false, message: '事件删除失败！'});
    }
    else if (waitModify.event === 'sortbylevel')
    {
        const rows = await pool.query('select * from things order by field(level,"null","低","中","高")');
        if (!rows[0].length) res.json({success: false, message: '事件查询失败！'});
        else res.json(rows[0]);
    }
    else if (waitModify.event === 'allclass')
    {
        const rows = await pool.query('select distinct class from things where class is not null');
        if (!rows[0].length) res.json({success: false, message: '类别查询失败！'});
        else res.json(rows[0]);
    }
});

// 监听
app.listen(PORT,HOST,()=>{
    console.log('To-Do-List launched!');
    console.log(`Click here to start your plan!: http://127.0.0.1:${PORT}`);
});