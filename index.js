require('dotenv').config()

const fs = require('fs')
const Koa = require('koa')
const koaBody = require('koa-body')

const createStore = file => {
  fs.exists(file, exists => {
    if (!exists) {
      fs.writeFile(file)
    }
  })
}

const save = (key, entry) => {
  const store = process.env.STORE_FILE || 'db.json'
  createStore(store)

  fs.readFile(store, (err, data) => {
    if (err) return

    let json
    try {
      json = JSON.parse(data)
    } catch (e) {
      json = {}
    }

    json[key] = json[key] || []
    json[key].push(entry)

    fs.writeFileSync(store, JSON.stringify(json))
  })
}

const app = new Koa()
app.use(koaBody())

app.use(async ctx => {
  ctx.body = { success: true }

  if (ctx.request.body.type) {
    save(ctx.request.body.type, ctx.request.body)
  }
})

app.listen(process.env.PORT || 3000)
