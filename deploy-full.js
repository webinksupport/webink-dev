/**
 * Full VPS deployment script for webink-dev
 */
const { Client } = require('ssh2');
const fs = require('fs');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

const config = {
  host: '31.97.11.49',
  port: 2222,
  username: 'root',
  privateKey: fs.readFileSync('C:/Users/OpenClaw/.ssh/id_ed25519_agent'),
};

function runCommand(conn, cmd, label) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    if (label) console.log(`\n▶ ${label}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', (d) => { stdout += d.toString(); process.stdout.write(d); });
      stream.stderr.on('data', (d) => { stderr += d.toString(); process.stderr.write(d); });
      stream.on('close', (code) => {
        if (code !== 0) {
          console.log(`(exit ${code})`);
        }
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
  console.log('✅ SSH connected to 31.97.11.49:2222');

  try {
    // Step 1: Setup directory and clone
    await runCommand(conn, 'mkdir -p /opt/webink-dev', 'Creating directory');
    
    // Stop any existing container
    await runCommand(conn, 'cd /opt/webink-dev && docker compose down 2>/dev/null || true', 'Stopping existing container');
    
    // Remove old code (keep any volumes)
    await runCommand(conn, 'rm -rf /opt/webink-dev && mkdir -p /opt/webink-dev', 'Clearing old directory');
    
    // Clone fresh
    const cloneUrl = `https://${GITHUB_TOKEN}@github.com/webinksupport/webink-dev.git`;
    const result = await runCommand(conn, `git clone ${cloneUrl} /opt/webink-dev`, 'Cloning repo');
    if (result.code !== 0) {
      throw new Error('Git clone failed');
    }

    // Step 2: Create Dockerfile
    const dockerfile = `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3001
ENV PORT=3001
CMD ["npm", "start"]
`;
    await runCommand(conn, `cat > /opt/webink-dev/Dockerfile << 'DOCKERFILE_EOF'
${dockerfile}DOCKERFILE_EOF`, 'Writing Dockerfile');

    // Step 3: Create docker-compose.yml
    const composefile = `version: '3.8'
services:
  webink-dev:
    build: .
    container_name: webink-dev
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - HOSTNAME=0.0.0.0
`;
    await runCommand(conn, `cat > /opt/webink-dev/docker-compose.yml << 'COMPOSE_EOF'
${composefile}COMPOSE_EOF`, 'Writing docker-compose.yml');

    // Step 4: Build and start
    console.log('\n▶ Building Docker image (this will take a few minutes...)');
    const buildResult = await runCommand(conn, 'cd /opt/webink-dev && docker compose up -d --build 2>&1', 'Docker build + start');
    
    // Wait for container to be healthy
    await new Promise(r => setTimeout(r, 5000));
    
    // Step 5: Check status
    await runCommand(conn, 'docker ps --filter name=webink-dev --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"', 'Container status');
    
    const siteCheck = await runCommand(conn, 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ 2>&1', 'Site check /');
    const pickCheck = await runCommand(conn, 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/pick 2>&1', 'Site check /pick');
    
    console.log('\n');
    console.log('Site /:', siteCheck.stdout.trim());
    console.log('Site /pick:', pickCheck.stdout.trim());

    // Step 6: Set up webhook on port 9879
    const webhookScript = `const http = require('http');
const { execSync } = require('child_process');
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    console.log(new Date().toISOString(), 'Webhook received, rebuilding...');
    try {
      execSync('cd /opt/webink-dev && git pull && docker compose up --build -d', { stdio: 'inherit' });
      res.writeHead(200); res.end('OK');
    } catch(e) {
      console.error(e.message);
      res.writeHead(500); res.end('Error');
    }
  } else {
    res.writeHead(200); res.end('webink-dev webhook ready');
  }
});
server.listen(9879, '0.0.0.0', () => console.log('Webhook listening on :9879'));
`;

    await runCommand(conn, `cat > /opt/webink-dev-webhook.js << 'WEBHOOK_EOF'
${webhookScript}WEBHOOK_EOF`, 'Writing webhook script');
    
    await runCommand(conn, 'pkill -f "webink-dev-webhook" 2>/dev/null; sleep 1; nohup node /opt/webink-dev-webhook.js > /var/log/webink-webhook.log 2>&1 &', 'Starting webhook');
    await new Promise(r => setTimeout(r, 2000));
    
    const webhookCheck = await runCommand(conn, 'curl -s http://localhost:9879/ 2>&1', 'Webhook check');
    console.log('\nWebhook response:', webhookCheck.stdout.trim());

    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅ DEPLOYMENT COMPLETE');
    console.log('═══════════════════════════════════════════════════');
    console.log('  🌐 Main:      http://31.97.11.49:3001/');
    console.log('  🎯 Pick:      http://31.97.11.49:3001/pick');
    console.log('  A  Variant A: http://31.97.11.49:3001/');
    console.log('  B  Variant B: http://31.97.11.49:3001/variant-b');
    console.log('  C  Variant C: http://31.97.11.49:3001/variant-c');
    console.log('  D  Variant D: http://31.97.11.49:3001/variant-d');
    console.log('  🔗 Webhook:   http://31.97.11.49:9879/webhook');
    console.log('  📦 GitHub:    https://github.com/webinksupport/webink-dev');
    console.log('═══════════════════════════════════════════════════');

  } finally {
    conn.end();
  }
}

main().catch(err => { console.error('Deployment failed:', err.message); process.exit(1); });
