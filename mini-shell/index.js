import { existsSync, statSync, readdirSync } from "fs";
import { spawnSync } from "child_process";
import path from "path";
import { createInterface } from "readline/promises";

const PATH = process.env.PATH;
const extensions = [".exe", ".cmd", ".bat"];

const isDir = (f) => existsSync(f) && statSync(f).isDirectory();

const bins = PATH.split(";").filter((d) => d && isDir(d));

const commands = {};

bins.forEach((currentDir) => {
  const cmds = readdirSync(currentDir).filter((c) =>
    extensions.includes(path.extname(c)),
  );

  cmds.forEach((cmd) => {
    const commandName = cmd.split(".").slice(0, -1).join(".");

    commands[commandName] = path.join(currentDir, cmd);
  });
});

let current = process.cwd();
const rd = createInterface(process.stdin);

while (true) {
  process.stdout.write(`${current}> `);
  const input = await rd.question("");

  if (input.trim() === "") continue;

  const [command, ...args] = input.split(" ");

  if (command in commands) {
    const executable = commands[command];

    spawnSync(`${executable} ${args.join("")}`, {
      stdio: "inherit",
    });
  } else if (command.toLowerCase() === "cd") {
    const relative = args.join(" ");

    const newPath = path.join(current, relative);

    if (existsSync(newPath) && isDir(newPath)) {
      current = newPath;
    } else {
      console.log(`No such directory ${relative}`);
    }
  } else if (command.toLocaleLowerCase() == "ls") {
    const files = readdirSync(current);

    files.forEach((file) => {
      console.log(file);
    });
  } else if (command.toLowerCase() == "clear") {
    console.clear();
  } else {
    console.log(`Command "${command}" not found`);
  }
}
