import app from "./app.js";
import pool from "./config/database.js";
const PORT = 4000;
try {
  await pool.query("SELECT 1");
  app.listen(PORT, () => {
    console.log(`API lista en http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("No fue posible conectar con MySQL:", error.message);
  process.exit(1);
}
