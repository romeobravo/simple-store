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

  fs.readFile(store, function(err, file) {
    const json = JSON.parse(file)
    json[key] = json[key] || []
    json[key].push(entry)

    fs.writeFile(store, JSON.stringify(json))
  })
}

const app = new Koa()
app.use(koaBody())

app.use(async ctx => {
  ctx.body = 'Hello World'
  save(process.env.STORE_KEY || 'list', ctx.request.body)
})

app.listen(process.env.PORT || 3000)
