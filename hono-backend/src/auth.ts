import { Hono } from 'hono'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getCookie, setCookie } from 'hono/cookie'
import { readFile } from 'fs/promises'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'


type Variables = {
    user: { id: number, email: string, role: string }
}
const auth = new Hono<{ Variables: Variables }>()
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
    await pool.query(`
    CREATE TABLE IF NOT EXISTS songs(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    album VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    genre VARCHAR(255),
    duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
    await pool.query(`  CREATE TABLE IF NOT EXISTS playlists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)
    await pool.query(`
  CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id INTEGER NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id)
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

auth.get('/me', authMiddleware, (c) => {
    const user = c.get('user')
    return c.json({ id: user.id, email: user.email, role: user.role })
})

///////////////////////////////////////SONGS ROUTES/////////////////////////////////////

//ziskat vsetky songs
auth.get('/songs', authMiddleware, async (c) => {
    const { rows } = await pool.query('SELECT * FROM songs ORDER BY created_at DESC')
    return c.json({ songs: rows })
})

//pridavanie novych pesniciek
auth.post('/songs', authMiddleware, adminMiddleware, async (c) => {
    const { title, album, artist, genre, duration } = await c.req.json()
    const { rows } = await pool.query(
        'INSERT INTO songs (title, album, artist, genre, duration) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, album, artist, genre, duration]
    )
    return c.json({ song: rows[0] }, 201)
})

//delete
auth.delete('/songs/:id', authMiddleware, adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'))
    await pool.query('DELETE FROM songs WHERE id = $1', [id])
    return c.json({ message: 'Song deleted' })
})

//update
auth.put('/songs/:id', authMiddleware, adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'))
    const { title, album, artist, genre, duration } = await c.req.json()
    const { rows } = await pool.query(
        'UPDATE songs SET title = $1, album = $2, artist = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING *',
        [title, album, artist, genre, duration, id]
    )
    return c.json({ song: rows[0] })
})

// Upload MP3
auth.post('/songs/upload/:id', authMiddleware, adminMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'))
    const formData = await c.req.formData()
    const file = formData.get('file') as File

    if (!file) {
        return c.json({ error: 'Žiadny súbor' }, 400)
    }

    // Validacia typu suboru
    if (!file.name.endsWith('.mp3')) {
        return c.json({ error: 'Povolené sú iba MP3 súbory' }, 400)
    }

    // Validacia velkosti (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        return c.json({ error: 'Súbor je príliš veľký (max 10MB)' }, 400)
    }

    // Uloz subor na disk
    const uploadsDir = join(process.cwd(), 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    const fileName = `${Date.now()}_${file.name}`
    const filePath = join(uploadsDir, fileName)
    const buffer = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(buffer))

    // Uloz cestu do databazy
    await pool.query(
        'UPDATE songs SET file_path = $1, file_size = $2 WHERE id = $3',
        [`uploads/${fileName}`, file.size, id]
    )

    return c.json({ message: 'Súbor nahraný' })
})

// Prehravanie MP3 - len prihlaseny user
auth.get('/songs/stream/:id', authMiddleware, async (c) => {
    const id = parseInt(c.req.param('id'))
    const { rows } = await pool.query('SELECT file_path FROM songs WHERE id = $1', [id])

    if (!rows[0]?.file_path) {
        return c.json({ error: 'Súbor nenájdený' }, 404)
    }

    const filePath = join(process.cwd(), rows[0].file_path)
    const file = await readFile(filePath)

    return new Response(file, {
        headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': file.length.toString(),
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache'
        }
    })
})

///////////////////////////////////////PLAYLIST ROUTES/////////////////////////////////////
//GET moje playlisty
auth.get('/playlists', authMiddleware, async (c) => {
    const user = c.get('user')
    const { rows } = await pool.query('SELECT * FROM playlists WHERE user_id = $1 ORDER BY created_at DESC', [user.id])
    return c.json({ playlists: rows })
})

//create playlist
auth.post('/playlists', authMiddleware, async (c) => {
    const user = c.get('user')
    const { name } = await c.req.json()
    const { rows } = await pool.query('INSERT INTO playlists (name, user_id) VALUES ($1, $2) RETURNING *',
        [name, user.id]
    )
    return c.json({ playlist: rows[0] }, 201)
})

//DELETE playlist
auth.delete('/playlists/:id', authMiddleware, async (c) => {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    await pool.query('DELETE FROM playlists WHERE id = $1 AND user_id = $2', [id, user.id])
    return c.json({ message: 'Playlist vymazany' })
})

//POST pridavanie song do playlistu
auth.post('/playlists/:id/songs', authMiddleware, async (c) => {
  const playlistId = parseInt(c.req.param('id'))
  const { songId } = await c.req.json()
  await pool.query(
    'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [playlistId, songId]
  )
  return c.json({ message: 'Pieseň pridaná' })
})

//GET piesne v playliste
auth.get('/playlists/:id/songs', authMiddleware, async (c) => {
  const playlistId = parseInt(c.req.param('id'))
  const { rows } = await pool.query(`
    SELECT s.* FROM songs s
    JOIN playlist_songs ps ON s.id = ps.song_id
    WHERE ps.playlist_id = $1
    ORDER BY ps.added_at DESC
  `, [playlistId])
  return c.json({ songs: rows })
})

//GET search songs
auth.get('/songs/search', authMiddleware, async (c) => {
  const query = c.req.query('q') || ''
  const { rows } = await pool.query(
    `SELECT * FROM songs WHERE file_path IS NOT NULL AND (title ILIKE $1 OR artist ILIKE $1)`,
    [`%${query}%`]
  )
  return c.json({ songs: rows })
})

//spristupni tento router pre index.ts
export default auth 