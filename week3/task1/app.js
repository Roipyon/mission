const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const { createReadStream } = require('fs');
const PORT = 5000;

// 静态文件根目录
const STATIC_DIR = path.join(__dirname,'public');

const server = http.createServer(async(req,res)=>{
    try {
        // 拼接文件路径
        let filePath = path.join(STATIC_DIR,req.url === '/'?'index.html':req.url);
        // 安全处理
        if (!filePath.startsWith(STATIC_DIR)) throw new Error('403');

        // 读取文件并返回
        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
            createReadStream(filePath).pipe(res);
        } else {
            throw new Error('404');
        }
    } catch (err) {
        res.writeHead(err.message === '403'?403:404);
        res.end('Not Found');
    }
});

server.listen(PORT,()=>{
    console.log('工艺与工序拖拽编排平台服务已启动！');
    console.log(`请打开浏览器访问：http://127.0.0.1:${PORT}`);
});