import app from "./app";

// PORT'un sayı olduğundan emin olalım
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  🚀 Server is running!`);
    console.log(`  > Local:    http://localhost:${PORT}`);
    console.log(`  > Network:  http://192.168.8.100:${PORT}\n`);
});