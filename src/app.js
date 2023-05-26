const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
const client = new Client();

app.use(express.json());

// Endpoint untuk mengirim pesan WhatsApp
app.post('/send-message', (req, res) => {
  const { phoneNumber, message } = req.body;

  // Kirim pesan ke nomor HP yang ditentukan
  client.sendMessage(phoneNumber+'@c.us', message)
    .then(() => {
      res.status(200).json({ success: true, message: 'Pesan berhasil dikirim' });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Gagal mengirim pesan', error: error.message });
    });
});

// Endpoint untuk mendapatkan QR code
app.get('/qr-code', (req, res) => {
  // Generate QR code menggunakan session dari client WhatsApp
  qrcode.toDataURL(client.qrCode, (err, url) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Gagal menghasilkan QR code' });
    } else {
      // Kirim QR code sebagai respons
      res.status(200).send(`<img src="${url}" alt="QR Code" />`);
    }
  });
});

// Inisialisasi WhatsApp client 
client.on('qr', (qr) => {
  // QR code tersedia, dapatkan URL-nya
  client.qrCode = qr;
});

client.on('ready', () => {
  console.log('Bot WhatsApp sudah terhubung');
});

client.initialize();

module.exports = app;