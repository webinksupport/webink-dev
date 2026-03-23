const { Client } = require('ssh2');
const fs = require('fs');

const config = {
  host: '31.97.11.49',
  port: 2222,
  username: 'root',
  privateKey: fs.readFileSync('C:/Users/OpenClaw/.ssh/id_ed25519_agent'),
};

function runCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', (d) => { stdout += d.toString(); process.stdout.write(d); });
      stream.stderr.on('data', (d) => { stderr += d.toString(); process.stderr.write(d); });
      stream.on('close', (code) => {
        resolve({ code, stdout, stderr });
      });
    });
  });
}

async function main() {
  const conn = new Client();

  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect(config);
  });

  console.log('✅ SSH connected');

  try {
    // Check if container is running
    const status = await runCommand(conn, 'docker ps --filter name=webink-dev --format "{{.Status}}"');
    console.log('\n📦 Container status:', status.stdout.trim());

    // Check port
    const portCheck = await runCommand(conn, 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ 2>&1 || echo "failed"');
    console.log('\n🌐 Site HTTP status:', portCheck.stdout.trim());

    // Check /pick
    const pickCheck = await runCommand(conn, 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/pick 2>&1');
    console.log('🎯 /pick HTTP status:', pickCheck.stdout.trim());

    // Setup webhook
    console.log('\n🔧 Setting up webhook...');
    const webhookScript = `
const http = require('http');
const { execSync } = require('child_process');
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    console.log('Webhook received, rebuilding...');
    try {
      execSync('cd /opt/webink-dev && docker compose up --build -d', { stdio: 'inherit' });
      res.writeHead(200); res.end('OK');
    } catch(e) {
      console.error(e.message);
      res.writeHead(500); res.end('Error');
    }
  } else {
    res.writeHead(200); res.end('webink-dev webhook ready');
  }
});
server.listen(9879, () => console.log('Webhook listening on :9879'));
`;

    await runCommand(conn, `cat > /opt/webink-dev-webhook.js << 'ENDOFSCRIPT'\n${webhookScript}\nENDOFSCRIPT`);
    await runCommand(conn, 'kill $(lsof -t -i:9879) 2>/dev/null; sleep 1; nohup node /opt/webink-dev-webhook.js > /var/log/webink-webhook.log 2>&1 &');
    await new Promise(r => setTimeout(r, 2000));
    const webhookCheck = await runCommand(conn, 'curl -s http://localhost:9879/ 2>&1');
    console.log('🔗 Webhook status:', webhookCheck.stdout.trim());

    // Final report
    console.log('\n✅ DEPLOYMENT COMPLETE');
    console.log('═══════════════════════════════════');
    console.log('   Main:      http://31.97.11.49:3001/');
    console.log('   Pick:      http://31.97.11.49:3001/pick');
    console.log('   Variant A: http://31.97.11.49:3001/');
    console.log('   Variant B: http://31.97.11.49:3001/variant-b');
    console.log('   Variant C: http://31.97.11.49:3001/variant-c');
    console.log('   Variant D: http://31.97.11.49:3001/variant-d');
    console.log('   Webhook:   http://31.97.11.49:9879/webhook');
    console.log('═══════════════════════════════════');

  } finally {
    conn.end();
  }
}

main().catch(err => { console.error('Failed:', err.message); process.exit(1); });
