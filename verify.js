const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

function run(conn, cmd) {
  return new Promise((resolve) => {
    let out = '';
    conn.exec(cmd, (err, s) => {
      if (err) return resolve('ERROR: ' + err.message);
      s.on('data', d => out += d);
      s.stderr.on('data', d => out += d);
      s.on('close', () => resolve(out.trim()));
    });
  });
}

conn.on('ready', async () => {
  console.log('Connected to VPS\n');
  
  const container = await run(conn, 'docker ps --filter name=webink-dev');
  console.log('DOCKER PS:\n' + container + '\n');

  const routes = ['/', '/pick', '/variant-b', '/variant-c', '/variant-d'];
  for (const route of routes) {
    const code = await run(conn, `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001${route}`);
    console.log(`  http://31.97.11.49:3001${route} => HTTP ${code}`);
  }

  const webhook = await run(conn, 'curl -s http://localhost:9879/');
  console.log(`\n  Webhook => ${webhook}`);

  conn.end();
}).connect({
  host: '31.97.11.49',
  port: 2222,
  username: 'root',
  privateKey: fs.readFileSync('C:/Users/OpenClaw/.ssh/id_ed25519_agent'),
});
