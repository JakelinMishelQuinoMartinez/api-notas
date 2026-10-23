import pool from "../config/database.js";

export const notaService = {
  async crear(datos) {
    const [result] = await pool.execute(
      "INSERT INTO notas (titulo, contenido, categoria) VALUES (?, ?, ?)",
      [datos.titulo, datos.contenido, datos.categoria],
    );
    return this.buscarPorId(result.insertId);
  },

  async listar() {
    const [rows] = await pool.execute("SELECT * FROM notas ORDER BY createdAt DESC");
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await pool.execute("SELECT * FROM notas WHERE id = ?", [id]);
    return rows[0] ?? null;
  },

  async actualizar(id, datos) {
    const fields = Object.keys(datos);
    if (fields.length === 0) return this.buscarPorId(id);

    const assignments = fields.map((field) => `\`${field}\` = ?`).join(", ");
    await pool.execute(`UPDATE notas SET ${assignments} WHERE id = ?`, [
      ...fields.map((field) => datos[field]),
      id,
    ]);
    return this.buscarPorId(id);
  },

  async eliminar(id) {
    const nota = await this.buscarPorId(id);
    if (!nota) return null;
    await pool.execute("DELETE FROM notas WHERE id = ?", [id]);
    return nota;
  },
};
