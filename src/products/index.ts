import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
const productsRoutes = new Hono()
// 27/11/2025
// const createProductSchema = z.object({
//     idproduct: z.number("กรุณากรอกรหัสสินค้า")
//         .refine((val) => val >= 10000 && val <= 99999, "รหัสสินค้าต้องมี 5 หลัก"),
//     nameproduct: z.string("กรุณากรอกชื่อสินค้า")
//         .min(5,"ชื่อต้องมีความยาวอย่างน้อย 5 ตัวอักษร"),
//     price: z.string("กรุณากรอกราคาสินค้า")
//         .regex(/^\d+\.\d{2}$/, "ราคาต้องเป็นทศนิยม 2 ตำแหน่ง")
//         .transform((val) => Number(val)),
//     cost : z.string("กรุณากรอกราคาต้นทุนสินค้า")
//         .regex(/^\d+\.\d{2}$/, "ราคาต้นทุนต้องเป็นทศนิยม 2 ตำแหน่ง")
//         .transform((val) => Number(val)),
//     note: z.string().optional(),
// })

// productsRoutes.get('/', (c) => {
//     return c.json({message: 'List of product'})
// })

// productsRoutes.get('/:id', (c) => {
//     const { id }= c.req.param()
//     return c.json({message: `product details for ID : ${id}`})
// })

// productsRoutes.post('/',
//     zValidator('json', createProductSchema),
//     async (c) => {
//     const body = await c.req.json()
//     return c.json({ message: 'User created',data: body })
// })

export default productsRoutes