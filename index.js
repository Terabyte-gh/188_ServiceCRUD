import express from 'express'
import pg from 'pg'

const app = express()
const port = 3000
const { Pool } = pg

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '',
    port: 5432,
})

// GET ALL
app.get('/', (req, res) => {
    pool.query('SELECT * FROM biodata ORDER BY id')
        .then(result => {
            res.send(result.rows)
        })
        .catch(err => {
            console.error(err)
            res.status(500).send('Internal Server Error')
        })
})

// POST (Tambah Data)
app.post('/biodata', (req, res) => {
    const { nama, nim, kelas } = req.body

    pool.query(
        'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
        [nama, nim, kelas]
    )
        .then(result => res.status(201).json(result.rows[0]))
        .catch(err => {
            console.error(err)
            res.status(500).send('Internal Server Error')
        })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
