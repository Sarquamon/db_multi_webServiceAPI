const http = require("http");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 2000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto: ${PORT}.`);
});
