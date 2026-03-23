const { Client } = require('ssh2');
const fs = require('fs');

const config = {
  host: '31.97.11.49',
  port: 2222,
  username: 'root',
  privateKey: fs.readFileSync('C:/Users/OpenClaw/.ssh/id_ed25519_agent'),
};

function runCmd(conn, cmd) {
  return new Promise((resolve, reject) => {
    let out = '';
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => { out += d.toString(); });
      stream.stderr.on('data', d => { out += d.toString(); });
      stream.on('close', () => resolve(out.trim()));
    });
  });
}

async function main() {
  const conn = new Client();
  await new Promise((resolve, reject) => conn.on('ready', resolve).on('error', reject).connect(config));
  
  try {
    const containerStatus = await runCmd(conn, 'docker ps --filter name=webink-dev --format "{{.Status}}"');
    console.log('Container:', containerStatus);
    
    const urls = ['/', '/pick', '/variant-b', '/variant-c', '/variant-d'];
    for (const url of urls) {
      const status = await runCmd(conn, `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001${url}`);
      console.log(`http://31.97.11.49:3001${url} → ${status}`);
    }
    
    // Ensure webhook is running
    const webhookCheck = await runCmd(conn, 'curl -s --max-time 2 http://localhost:9879/ 2>&1 || echo "not running"');
    if (webhookCheck.includes('not running') || webhookCheck === '') {
      console.log('Starting webhook...');
      await runCmd(conn, 'nohup node /opt/webink-dev-webhook.js > /var/log/webink-webhook.log 2>&1 &');
      await new Promise(r => setTimeout(r, 2000));
      const recheck = await runCmd(conn, 'curl -s --max-time 2 http://localhost:9879/ 2>&1');
      console.log('Webhook:', recheck);
    } else {
      console.log('Webhook:', webhookCheck);
    }
  } finally {
    conn.end();
  }
}

main().catch(console.error);
