/* eslint-disable no-console */
const { createClient } = require('@libsql/client')
const { randomUUID } = require('crypto')

function loadDotEnv() {
  try {
    const fs = require('fs')
    const path = require('path')
    const envPath = path.resolve(__dirname, '..', '.env')
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
      for (const line of lines) {
        if (!line || /^\s*#/.test(line)) continue
        const idx = line.indexOf('=')
        if (idx === -1) continue
        const key = line.slice(0, idx).trim()
        const val = line.slice(idx + 1).trim()
        if (!process.env[key]) process.env[key] = val
      }
    }
  } catch {}
}

async function main() {
  loadDotEnv()
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  if (!url) {
    console.error('Missing TURSO_DATABASE_URL in environment')
    process.exit(1)
  }
  const client = createClient({ url, authToken })
  const now = new Date().toISOString()

  const entries = [
    { role: 'Penasehat', name: 'Slamet Yadi' },
    { role: 'Pengawas', name: 'Heru Setiawan, S.Pd.' },
    { role: 'Ketua', name: 'Firman Febri Cahyana, S.H., C.MSP' },
    { role: 'Wakil Ketua', name: 'Moh. Rifki, S.H.' },
    { role: 'Sekretaris', name: 'Vivi Anjarwati, S.Pd.' },
    { role: 'Bendahara', name: 'Yasmin Nanda Aditama, S.H.' },
    { role: 'Wakil Bendahara', name: 'Wiyanda Nindi Aditama, A.Md.' },
  ]

  try {
    await client.execute('DELETE FROM TeamMember')
    let count = 0
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i]
      await client.execute({
        sql:
          'INSERT INTO TeamMember (id, name, role, description, education, imageUrl, `order`, active, createdAt, updatedAt) ' +
          'VALUES (?, ?, ?, ?, ?, NULL, ?, 1, ?, ?)',
        args: [randomUUID(), e.name, e.role, 'Pengurus Yayasan', '-', i + 1, now, now],
      })
      count++
    }
    console.log(JSON.stringify({ ok: true, inserted: count }))
  } catch (err) {
    console.error(err)
    process.exit(1)
  } finally {
    try {
      await client.close()
    } catch {}
  }
}

main()
