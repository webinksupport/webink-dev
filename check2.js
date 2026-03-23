const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  const cmd = 'cat /opt/webink-dev/docker-compose.yml ; echo "---LOGS---" ; docker logs webink-dev --tail=20 2>&1';
  conn.exec(cmd, (err, stream) => {
    if (err) { console.error(err); conn.end(); return; }
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: '31.97.11.49', port: 2222, username: 'root',
  privateKey: fs.readFileSync('C:/Users/OpenClaw/.ssh/id_ed25519_agent'),
});
