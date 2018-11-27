// https://www.youtube.com/watch?v=FV1Ugv1Temg&index=3&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
console.log("Listening auth service on port:" + port);