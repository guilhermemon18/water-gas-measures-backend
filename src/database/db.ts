// database.ts
import Database from "better-sqlite3";

// Criando e exportando a conexão com o banco de dados
const db = new Database("./database.db", { verbose: console.log });

db.exec(`
    CREATE TABLE IF NOT EXISTS measures (
      measure_uuid TEXT PRIMARY KEY NOT NULL,
      customer_code TEXT NOT NULL,
      measure_datetime DATETIME NOT NULL,
      measure_type TEXT CHECK (measure_type IN ('WATER', 'GAS')) NOT NULL,
      measure_value INTEGER,
      image_url TEXT,
      has_confirmed BOOLEAN DEFAULT 0
    )
  `);

console.log('Tabela "measures" criada com sucesso!');

export default db;
