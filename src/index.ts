import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import usersRoutes from './users/index.js'
import rolesRoutes from './roles/index.js'
import productsRoutes from './products/index.js'
import prescriptionRoutes from './prescription/index.js'

//import database
import db from './db/index.js'

const app = new Hono()
/* 13/11/2025
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/welcome', (c) => {
  return c.html(`
    <h1>Welcome !</h1>
    <h2>To my website !!</h2>
    `)
})

app.get('/api/ping', (c) => {
  return c.json({
    message: 'pong'
  })
})
app.get('/api/welcome', (c) => {
  return c.json({
    msg: 'Welcome to 67026427 website'
  })
})

app.get('/page/welcome', (c) => {
  return c.html(`
    <h1
      style="font-size:2em;background:linear-gradient(90deg,#ff8c00,#ff0080,#8000ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;white-space:nowrap;border-right:3px solid rgba(255,255,255,0.75);width:fit-content;overflow:hidden;animation:typing 4s steps(40,end) 1s forwards,blink 0.75s step-end infinite;@keyframes typing{from{width:0}to{width:100%}}@keyframes blink{from,to{border-color:transparent}50%{border-color:rgba(255,255,255,0.75)}}">
      Welcome to 67026427 ภัทรวินทร์ รุ่งพนารัตน์ website!!
    </h1>
    `)
})
*/



//20/11/2025
// HTTOP METHODs
/*
app.get('/', (c) => c.text("GET /"))
app.post('/', (c) => c.text("POST /"))
app.put('/', (c) => c.text("PUT /"))
app.delete('/', (c) => c.text("DELETE /"))
*/
// Wildcard
//app.get('wild/card', (c) => {
//  return c.text('GET /wild/*/card')
//})
/*
// Any Method
app.all('/hello', (c) =>c.text("any Method /hello"))

// Custom HTTP Method
app.on('PURGE','/cache', (c) => c.text("PURGE Method /cache"))

// Multiple Method
app.on(['PUT','DELETE'], '/post', (c) =>
  c.text("PUT or DELETE /post")
)

app.get('/api/users', (c) => c.text("Get all users/ getusers list"))
app.get('/api/users/:id', (c) => c.text("Read Users data of" + c.req.param()))

app.post('/api/users',async (c) => {
  const body = await c.req.json()
  return c.json({ message: 'Data received',data: body })
})

app.get('/api/products', (c) => c.text("Get all products/ getproducts list"))
app.get('/api/products/:id', (c) => c.text("Read Products data of" + c.req.param('id')))

app.post('/api/products',async (c) => {
  const body = await c.req.json()
  return c.json({ message: 'Data received',data: body})
})

app.put('/api/products/:id',async (c) => {
  const body = await c.req.json()
  const id = c.req.param('id')
  return c.json({ message: 'Data updated ' + c.req.param('id') ,data: body})
})

app.delete('/api/products/:id',async (c) => {
  const id = c.req.param('id')
  return c.json({ message: 'Data deleted for id',id: id})
})
*/


// 27/11/2025
// app.route('/api/users', usersRoutes)
// app.route('/api/roles', rolesRoutes)
// app.route('/api/products', productsRoutes)



// 11/12/2025
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.route('/api/users', usersRoutes)
app.route('/api/roles', rolesRoutes)
app.route('/api/products', productsRoutes)
app.route('/api/prescription', prescriptionRoutes)


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
