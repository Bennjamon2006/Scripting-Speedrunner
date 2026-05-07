const url = process.argv[2];

if (!url) {
  console.log("Insert URL");
  process.exit(1);
}

let id = null;

async function requestTerminal() {
  console.log("Requesting terminal...");
  const res = await fetch(url, {
    method: "POST",
  });

  if (!res.ok) {
    console.log("Unable to create terminal");
    process.exit(1);
  }

  const body = await res.json();

  id = body.id;
}

async function connectToTerminal() {
  console.log("Connecting to terminal...");
  const res = await fetch(`${url}/${id}`);

  if (res.status === 404) {
    console.log("Terminal closed");
    process.exit(1);
  }

  const decoder = new TextDecoder();

  const reader = await res.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });

    process.stdout.write(chunk);
  }
}

async function exec(cmd) {
  await fetch(`${url}/${id}`, {
    method: "POST",
    body: cmd,
  });
}

requestTerminal().then(() => {
  connectToTerminal();

  process.stdin.on("data", (chunk) => {
    exec(chunk.toString());
  });
});
