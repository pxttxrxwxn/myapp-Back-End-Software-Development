import Database from 'better-sqlite3';

async function intializeDatabase() {
    // สร้างการเชื่อมต่อกับฐานข้อมูล SQLite
    // หากไฟล์ฐานข้อมูลยังไม่มี จะถูกสร้างขึ้นใหม่
    const optionn ={verbose: console.log};
    const db = new Database('app.db',optionn);

    return db;
}

const db = await intializeDatabase();

export default db


