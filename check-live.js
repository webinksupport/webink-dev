const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  const cmd = 'docker ps --format "{{.Names}} {{.Status}} {{.Ports}}" ; sleep 1 ; curl -s -o /dev/null -w "variant-e: %{http_code}\\n" http://localhost:3001/variant-e ; curl -s -o /dev/null -w "variant-f: %{http_code}\\n" http://localhost:3001/variant-f ; curl -s -o /dev/null -w "pick: %{http_code}\\n" http://localhost:3001/pick';
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
conn.on('error', e => { console.error('Connection error:', e.message); process.exit(1); });
