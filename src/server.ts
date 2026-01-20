import app from "./app";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n  🚀 Server is running!`);
    console.log(`  > Local:    http://localhost:${PORT}`);
    console.log(`  > Network:  http://127.0.0.1:${PORT}\n`);
});