// Run with: node qr.cjs
// Prints a QR code for the Vite dev server network URL.
const os = require('os');
const qr = require('qrcode-terminal');

const PORT = 5173;

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}

const ip  = getLocalIP();
const url = `http://${ip}:${PORT}`;

console.log('\n  Scan to open the app on your phone:\n');
qr.generate(url, { small: true });
console.log(`\n  ${url}\n`);
console.log('  Make sure your phone is on the same Wi-Fi network.\n');
