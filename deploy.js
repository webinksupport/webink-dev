const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

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
      stream.on('data', (d) => { stdout += d; process.stdout.write(d); });
      stream.stderr.on('data', (d) => { stderr += d; process.stderr.write(d); });
      stream.on('close', (code) => {
        if (code !== 0) reject(new Error(`Command failed (${code}): ${cmd}\n${stderr}`));
        else resolve(stdout);
      });
    });
  });
}

function uploadFile(conn, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const readStream = fs.createReadStream(localPath);
      const writeStream = sftp.createWriteStream(remotePath);
      writeStream.on('close', resolve);
      writeStream.on('error', reject);
      readStream.pipe(writeStream);
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
    // Setup dirs
    await runCommand(conn, 'mkdir -p /opt/webink-dev');

    // Upload tarball
    console.log('📦 Creating tarball locally...');
    const tarPath = '/tmp/webink-dev.tar.gz';

    // Upload it
    console.log('🚀 Uploading tarball...');
    const localTar = path.join(__dirname, 'webink-dev.tar.gz');
    await uploadFile(conn, localTar, '/opt/webink-dev/webink-dev.tar.gz');
    console.log('✅ Upload complete');

    // Extract and build
    await runCommand(conn, 'cd /opt/webink-dev && tar -xzf webink-dev.tar.gz');
    console.log('✅ Extracted');

    // Docker build
    await runCommand(conn, 'cd /opt/webink-dev && docker compose down 2>/dev/null || true');
    await runCommand(conn, 'cd /opt/webink-dev && docker compose up --build -d');
    console.log('✅ Docker running');

    // Setup webhook
    await runCommand(conn, `
cat > /opt/webink-dev-webhook.js << 'EOF'
const http = require('http');
const { execSync } = require('child_process');
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    console.log('Webhook received, rebuilding...');
    try {
      execSync('cd /opt/webink-dev && git pull && docker compose up --build -d', { stdio: 'inherit' });
      res.writeHead(200); res.end('OK');
    } catch(e) {
      res.writeHead(500); res.end('Error');
    }
  } else {
    res.writeHead(200); res.end('webink-dev webhook ready');
  }
});
server.listen(9879, () => console.log('Webhook listening on :9879'));
EOF
`);

    // Start webhook as daemon
    await runCommand(conn, 'pkill -f webink-dev-webhook || true');
    await runCommand(conn, 'nohup node /opt/webink-dev-webhook.js > /var/log/webink-webhook.log 2>&1 &');

    // Verify
    await new Promise(r => setTimeout(r, 5000));
    const result = await runCommand(conn, 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/pick || echo "not_ready"');
    console.log(`\n🌐 Site check: ${result.trim()}`);

    console.log('\n✅ DEPLOYMENT COMPLETE');
    console.log('   Main: http://31.97.11.49:3001/');
    console.log('   Pick: http://31.97.11.49:3001/pick');
    console.log('   Variant B: http://31.97.11.49:3001/variant-b');
    console.log('   Variant C: http://31.97.11.49:3001/variant-c');
    console.log('   Variant D: http://31.97.11.49:3001/variant-d');

  } finally {
    conn.end();
  }
}

main().catch(err => { console.error('Deploy failed:', err.message); process.exit(1); });
