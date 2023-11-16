const http = require ('http');
const app = require ('./app');

//check if server admiistrator specify port
const PORT = process.env.PORT || 8000;

const server = http.createServer (app);

server.listen (() => {
  console.log (`Listening on port ${PORT}`);
});
