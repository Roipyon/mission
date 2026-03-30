const http = require('http');
const server = http.createServer();
const PORT = 5000;
server.listen(PORT,()=>{
    console.log('工艺与工序拖拽编排平台服务已启动！');
    console.log(`请打开浏览器访问：http://127.0.0.1:${PORT}`);
});