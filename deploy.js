const { Client } = require('ssh2');
const { execSync } = require('child_process');
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
        if (code !== 0 && code !== null) reject(new Error(`Command failed (${code}): ${cmd}\n${stderr}`));
        else resolve(stdout);
      });
    });
  });
}

function uploadFile(conn, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const localSize = fs.statSync(localPath).size;
      console.log(`   Local file size: ${(localSize / 1024 / 1024).toFixed(1)} MB`);
      const readStream = fs.createReadStream(localPath);
      const writeStream = sftp.createWriteStream(remotePath);
      writeStream.on('error', reject);
      readStream.on('error', reject);
      readStream.pipe(writeStream);
      writeStream.on('close', () => {
        // Verify remote file size matches local
        sftp.stat(remotePath, (statErr, stats) => {
          if (statErr) return reject(statErr);
          console.log(`   Remote file size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
          if (stats.size !== localSize) {
            return reject(new Error(`Upload size mismatch: local=${localSize} remote=${stats.size}`));
          }
          resolve();
        });
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
    // Setup dirs
    await runCommand(conn, 'mkdir -p /opt/webink-dev');

    // Create tarball locally with all project files
    console.log('📦 Creating tarball locally...');
    const localTar = path.join(__dirname, 'webink-dev.tar.gz');
    try {
      execSync(
        'tar -czf webink-dev.tar.gz --exclude=node_modules --exclude=.next --exclude=.git --exclude=webink-dev.tar.gz --exclude=migration .',
        { cwd: __dirname, stdio: 'inherit' }
      );
    } catch (tarErr) {
      // tar exits with code 1 for "file changed as we read it" — safe to ignore if tarball exists
      if (fs.existsSync(localTar) && fs.statSync(localTar).size > 1024) {
        console.log('⚠️  tar warning (file changed during read) — tarball created successfully');
      } else {
        throw tarErr;
      }
    }
    console.log('✅ Tarball created');

    // Upload via scp (more reliable for large files than SFTP streaming)
    console.log('🚀 Uploading tarball via scp...');
    execSync(
      `scp -P 2222 -i C:/Users/OpenClaw/.ssh/id_ed25519_agent -o StrictHostKeyChecking=no "${localTar}" root@31.97.11.49:/opt/webink-dev/webink-dev.tar.gz`,
      { stdio: 'inherit', timeout: 600000 }
    );
    console.log('✅ Upload complete');

    // Extract and build
    await runCommand(conn, 'cd /opt/webink-dev && tar -xzf webink-dev.tar.gz');
    console.log('✅ Extracted');

    // Docker build
    await runCommand(conn, 'cd /opt/webink-dev && docker compose down 2>/dev/null || true');
    await runCommand(conn, 'cd /opt/webink-dev && docker compose up --build -d');
    console.log('✅ Docker running');

    // Seed admin user + products (run via tsx since Prisma 7.x is ESM-only)
    console.log('👤 Ensuring admin user exists...');
    await runCommand(conn, `docker exec webink-dev npx tsx -e "
import { PrismaClient } from './src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';
(async () => {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  const prisma = new PrismaClient({ adapter }) as PrismaClient;
  const hash = await bcrypt.hash('WebinkAdmin2026!', 12);
  await prisma.user.upsert({
    where: { email: 'sean@webink.solutions' },
    update: { password: hash, role: 'ADMIN', name: 'Sean Rowe' },
    create: { email: 'sean@webink.solutions', password: hash, role: 'ADMIN', name: 'Sean Rowe' },
  });
  console.log('Admin user ready');
  await prisma.\\$disconnect();
})();
"`);
    console.log('✅ Admin user seeded');

    // Seed products from WooCommerce data
    console.log('🛒 Seeding products...');
    await runCommand(conn, `docker exec webink-dev npx tsx prisma/seed.ts`);
    console.log('✅ Products seeded');

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
