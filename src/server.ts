import app from "./app";

// PORT'un sayı olduğundan emin olalım
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  🚀 Server is running!`);
});

// // Nginx (90s) ve Cloudflare (60s) ile tam uyum için buraya ekliyoruz:
// server.keepAliveTimeout = 95000; // 95 saniye (milisaniye cinsinden)
// server.headersTimeout = 96000;   // 96 saniye (keepAliveTimeout'tan 1 saniye büyük olmalı)