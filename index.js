require('dotenv').config()

const fs = require('fs')
const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const uuid = require('uuid/v1');

const createStore = file => {
  return new Promise((resolve, reject) => {  
    fs.exists(file, exists => {
      if (!exists) {
        fs.writeFileSync(file)
      }
      resolve()
    })
  })
}

const save = async (entry) => {
  const store = process.env.STORE_FILE || 'db.json'
  await createStore(store)

  return new Promise((resolve, reject) => {
    fs.readFile(store, (err, data) => {
      if (err) return

      let json
      try {
        json = JSON.parse(data)
      } catch (e) {
        json = {}
      }

      const id = uuid()
      json = json || {}
      json[id] = entry

      fs.writeFileSync(store, JSON.stringify(json))
      
      resolve(id)
    })
  })
}

const get = async (key) => {
  const store = process.env.STORE_FILE || 'db.json'
  createStore(store)

  return new Promise((resolve, reject) => {
    fs.readFile(store, (err, data) => {
      if (err) return
      
      let json
      try {
        json = JSON.parse(data)
      } catch (e) {
        json = {}
      }
      
      resolve(json[key])
    })  
  })
  
}

const app = new Koa()
app.use(cors())
app.use(koaBody())

app.use(async ctx => {

  if (ctx.request.body.type) {
    const id = await save(ctx.request.body)
    console.log(id);
    ctx.body = { success: true, id: id }
  }

  if (ctx.request.body.id) {
    ctx.body = await get(ctx.request.body.id)
  }
})

app.listen(process.env.PORT || 3000)
