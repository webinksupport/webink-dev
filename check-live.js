const mariadb = require("mariadb");
async function test() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  try {
    const pool = mariadb.createPool(process.env.DATABASE_URL + "?connectionLimit=1");
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT COUNT(*) as cnt FROM Product");
    console.log("Product count:", rows[0].cnt);
    conn.release();
    await pool.end();
  } catch(e) {
    console.error("DB Error:", e.message);
  }
}
test();
