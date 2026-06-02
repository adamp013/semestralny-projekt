import { Hono } from 'hono'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getCookie, setCookie } from 'hono/cookie'


type Variables = {
    user: { id: number, email: string, role: string }
}
const auth = new Hono<{ Variables: Variables }>()// ← len toto, žiadne app.route tu
//New Pool otvori nove pripojenie na databazu pomocou URL z .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

async function initDB() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user'
    )
  `)
}
initDB()

//Caka na POST request na /api/auth/register. c.req.json() nacitava heslo a mail co posiela frontEnd, bcrypthash ho zasifruje
auth.post('/register', async (c) => {
    const { email, password, role } = await c.req.json()
    const hashed = await bcrypt.hash(password, 10)
    const userRole = role === 'admin' ? 'admin' : 'user'
    await pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
        [email, hashed, userRole]
    )
    return c.json({ message: 'Registracia uspesna ' }, 201)
})

//Nacita heslo a mail z requestu, v databaze najde usera podla emailu. rows[0] zoberei prvy a jediny vysledok. bcrypt.compare porovna heslo z requestu s hashnutym heslom v databaze. Ak sa nezhoduju, vrati chybu 401. Ak sa zhoduju, vytvori JWT token s id a emailom usera, podpisany tajnym klucom z .env a nastavi expiraciu na 1 hodinu. Token sa posle naspat klientovi.
auth.post('/login', async (c) => {
    const { email, password } = await c.req.json()
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    )
    const user = rows[0]
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return c.json({ error: 'Nespravny email alebo heslo' }, 401)
    }
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    )
    //Tu sa nastavi cookie s nazvom token, hodnotou tokenu, HttpOnly, Path=/ a Max-Age=3600 sekund (1 hodina)
    setCookie(c, 'token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 3600,
        sameSite: 'Lax'
    })
    setCookie(c, 'isLoggedIn', 'true', {
        path: '/',
        maxAge: 3600,
        sameSite: 'Lax'
    })
    return c.json({ message: 'Prihlasenie uspesne' })
})

auth.post('/logout', (c) => {
  setCookie(c, 'token', '', { httpOnly: true, path: '/', maxAge: 0 })
  setCookie(c, 'isLoggedIn', '', { path: '/', maxAge: 0 })
  return c.json({ message: 'Odhlasenie uspesne' })
})

//middleware - kontrola tokenu
const authMiddleware = async (c: any, next: any) => {
    const token = getCookie(c, 'token')
    console.log('token z cookie:', token)  // ← pridaj toto
    console.log('vsetky cookies:', c.req.header('cookie'))  // ← pridaj toto
    if (!token) {
        return c.json({ error: 'Unathorized' }, 401)
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, email: string, role: string }
        c.set('user', payload)
        await next()
    } catch {
        return c.json({ error: 'Unathorized' }, 401)
    }
}

//admin middleware - kontrola role
const adminMiddleware = async (c: any, next: any) => {
    const user = c.get('user')
    if (user.role !== 'admin') {
        return c.json({ error: 'Forbidden' }, 403)
    }
    await next()
}

auth.get('/admin', authMiddleware, adminMiddleware, (c) => {
    return c.json({ message: 'Vitaj admin!' })
})

auth.delete('/admin/users/:id', authMiddleware, adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'))
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    return c.json({ message: 'Pouzivatel vymazany' })
})

//admin zoznam vsetkych userov
auth.get('/admin/users', authMiddleware, adminMiddleware, async (c) => {
    const { rows } = await pool.query('SELECT id, email, role FROM users');
    return c.json({ users: rows })
})

//spristupni tento router pre index.ts
export default auth 