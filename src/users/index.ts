import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import db from '../db/index.js'
const usersRoutes = new Hono()

// 27/11/2025
// const createUserSchema = z.object({
//     name: z.string("กรุณากรอกชื่อ")
//         .min(2,"ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร"),
//     email: z.email("รูปแบบอีเมลไม่ถูกต้อง"),
//     phone : z.string("กรุณากรอกเบอร์โทร")
//         .min(10,"เบอร์โทรต้องมีความยาวอย่างน้อย 10 ตัวอักษร")
//         .max(15,"เบอร์โทรต้องมีความยาวไม่เกิน 15 ตัวอักษร")
//         .optional(),
// })

// usersRoutes.get('/', (c) => {
//     return c.json({message: 'List of users'})
// })

// usersRoutes.get('/:id', (c) => {
//     const { id }= c.req.param()
//     return c.json({message: `User details for ID : ${id}`})
// })

// usersRoutes.post('/',
//     zValidator('json', createUserSchema),
//     async (c) => {
//     const body = await c.req.json()
//     return c.json({ message: 'User created',data: body })
// })


/* 11/12/2025 */
type User = {
    id : number
    username : string
    password : string
    firstname : string
    lastname : string
}
usersRoutes.get('/', (c) => {
    let sql = 'SELECT * FROM users'
    let stmt = db.prepare<[],User>(sql)
    let users : User[] = stmt.all()

    return c.json({message: 'List of users',data: users})
})

usersRoutes.get('/:id', (c) => {
    const { id } = c.req.param()
    let sql = 'SELECT * FROM users WHERE id = @id'
    let stmt = db.prepare<{id : string},User>(sql)
    let user  = stmt.get({id : id})

    if (!user) {
        return c.json({message: `User not found`},404)
    }
    return c.json({
        message: `User details for ID : ${id}`,
        data: user
    })
})

const createUserSchema = z.object({
    username: z.string("กรุณากรอกชื่อผู้ใช้")
        .min(5,"ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 5 ตัวอักษร"),
    password: z.string("กรุณากรอกรหัสผ่าน"),
    firstname: z.string("กรุณากรอกชื่อ").optional(),
    lastname: z.string("กรุณากรอกนามสกุล").optional(),
})

usersRoutes.post('/',
    zValidator('json', createUserSchema,(result,c)=>{
        if (!result.success) {
            const error = result.error.issues.map((err) => err.message)
            return c.json({message: 'Validation Failed',
                error : result.error.issues }, 400)
        }
    }),
    async (c) => {
    const body = await c.req.json<User>()
    let sql = `INSERT INTO users
        (username, password, firstname, lastname)
        VALUES(@username, @password, @firstname, @lastname);
    `
    let stmt = db.prepare<Omit<User,'id'>,User>(sql)
    let result = stmt.run(body)

    if (result.changes === 0) {
        return c.json({ message: 'User not created' },500)
    }
    let lastRowid = result.lastInsertRowid as number

    let sql2 = `SELECT * FROM users WHERE id = ?`
    let stmt2 = db.prepare<[number],User>(sql2)
    let newUser  = stmt2.get(lastRowid)
    return c.json({ message: 'User created',data: newUser } ,201)
})


const updateUserSchema = z.object({
    username: z.string().min(5).optional(),
    password: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
})
usersRoutes.put('/:id',
    zValidator('json', updateUserSchema),async (c) => {
    const { id } = c.req.param()
    const body = await c.req.json()

    const exists = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    if (!exists) return c.json({ message: 'User not found' }, 404)

    const sql = `
        UPDATE users SET
            username = COALESCE(@username, username),
            password = COALESCE(@password, password),
            firstname = COALESCE(@firstname, firstname),
            lastname = COALESCE(@lastname, lastname)
        WHERE id = @id
    `
    const stmt = db.prepare(sql)
    stmt.run({ ...body, id })

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(id)

    return c.json({ message: 'User updated', data: updated })
    }
)

usersRoutes.delete('/:id', (c) => {
    const { id } = c.req.param()

    const stmt = db.prepare('DELETE FROM users WHERE id = ?')
    const result = stmt.run(id)

    if (result.changes === 0) {
    return c.json({ message: 'User not found' }, 404)
    }

    return c.json({ message: 'User deleted', id })
})

export default usersRoutes