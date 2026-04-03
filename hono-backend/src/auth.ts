import { Hono } from "hono";
import { Pool } from 'pg';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

//vlastne mini-router len pre auth
const auth = new Hono()
//New Pool otvori nove pripojenie na databazu pomocou URL z .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `)
}
initDB()

//Caka na POST request na /api/auth/register. c.req.json() nacitava heslo a mail co posiela frontEnd, bcrypthash ho zasifruje
auth.post('/register', async (c) => {
    const { email, password } = await c.req.json()
    const hashed = await bcrypt.hash(password, 10)
    await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [email, hashed]
    )
    return c.json({ message: 'Registracia uspesna '}, 201)
})

//Nacita heslo a mail z requestu, v databaze najde usera podla emailu. rows[0] zoberei prvy a jediny vysledok. bcrypt.compare porovna heslo z requestu s hashnutym heslom v databaze. Ak sa nezhoduju, vrati chybu 401. Ak sa zhoduju, vytvori JWT token s id a emailom usera, podpisany tajnym klucom z .env a nastavi expiraciu na 1 hodinu. Token sa posle naspat klientovi.
auth.post('/login', async (c) => {
    const { email, password } = await c.req.json()
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1', 
        [email]
    )
    const user = rows[0]
    if(!user || !(await bcrypt.compare(password, user.password))) {
        return c.json({ error: 'Nespravny email alebo heslo'}, 401)
    }
    const token = jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    )
    return c.json({ token })
})

//spristupni tento router pre index.ts
export default auth 