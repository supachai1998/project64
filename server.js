// server.js
const { createServer } = require('http')
const express = require('express')
const { parse } = require('url')
const next = require('next')
const path = require('path')

const dev = false
const hostname = '0.0.0.0'
const port = process.env.PORT || 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()

    server.use(express.static(path.join(__dirname, 'public')))
    server.all('*', (req, res) => {
        return handle(req, res)
    })
    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on ${hostname}:${port}`)
    })
})