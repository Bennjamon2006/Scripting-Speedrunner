const { spawnSync, spawn } = require("child_process");
const http = require("http");
const { URL } = require("url");

const PORT = 3000;
const HOST = "localhost";

const url = `http://${HOST}:${PORT}`;

const terminals = {};
const queues = {};
const clients = {};

let currentId = 1;

const createTerminal = () => {
  const terminal = spawn("cmd");
  let id = currentId++;

  terminal.stdout.on("data", (chunk) => {
    const data = chunk.toString();

    if (clients[id]) {
      clients[id].write(data);
    } else {
      queues[id] ||= [];

      queues[id].push(data);
    }
  });

  terminals[id] = terminal;

  return id;
};

const server = http.createServer((req, res) => {
  const path = new URL(req.url, url).pathname;

  if (req.method === "POST" && path === "/") {
    const id = createTerminal();

    res.write(JSON.stringify({ id }));
    res.end();
  }
  if (req.method === "GET" && /^\/\d+(\/|)$/.exec(path)) {
    const id = parseInt(path.replaceAll("/", ""));

    if (!terminals[id]) {
      res.writeHead(404);
      res.write("Not found");
      res.end();

      return;
    }

    clients[id] = res;

    if (queues[id]) {
      queues[id].forEach((data) => {
        res.write(data);
      });

      queues[id].length = 0;
    }
  }

  if (req.method === "POST" && /^\/\d+(\/|)$/.exec(path)) {
    const id = parseInt(path.replaceAll("/", ""));

    if (!terminals[id]) {
      res.writeHead(404);
      res.write("Not found");
      res.end();

      return;
    }

    req.on("data", (chunk) => {
      terminals[id].stdin.write(chunk);
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening in ${url}`);
});
