import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import db from '../db/index.js'
const prescriptionRoutes = new Hono()

type Prescription = {
    prescriptionID : number
    date : string
    medicinename : string
    dosage : string
    notes : string
}
prescriptionRoutes.get('/', (c) => {
    let sql = 'SELECT * FROM prescriptions'
    let stmt = db.prepare<[],Prescription>(sql)
    let prescriptions : Prescription[] = stmt.all()

    return c.json({message: 'List of prescriptions',data: prescriptions})
})

prescriptionRoutes.get('/:prescriptionID', (c) => {
    const { prescriptionID } = c.req.param()
    let sql = 'SELECT * FROM prescriptions WHERE prescriptionID = @prescriptionID'
    let stmt = db.prepare<{prescriptionID : string},Prescription>(sql)
    let prescription  = stmt.get({prescriptionID : prescriptionID})

    if (!prescription) {
        return c.json({message: `Prescriptions not found`},404)
    }
    return c.json({
        message: `Prescriptions details for PrescriptionID : ${prescriptionID}`,
        data: prescription
    })
})

const createPrescriptionSchema = z.object({
    date: z.string("กรุณากรอกวันที่")
        .min(5,"วันที่ต้องมีความยาวอย่างน้อย 5 ตัวอักษร"),
    medicinename: z.string("กรุณากรอกชื่อยา").trim().min(1, 'ชื่อยาห้ามเว้นว่าง'),
    dosage: z.string("กรุณากรอกขนาดยา").trim().min(1, 'ขนาดยาห้ามเว้นว่าง'),
    notes: z.string("กรุณากรอกหมายเหตุ").optional(),
})

prescriptionRoutes.post('/',
    zValidator('json', createPrescriptionSchema,(result,c)=>{
        if (!result.success) {
            const error = result.error.issues.map((err) => err.message)
            return c.json({message: 'Validation Failed',
                error : result.error.issues }, 400)
        }
    }),
    async (c) => {
    const body = await c.req.json<Prescription>()
    let sql = `INSERT INTO prescriptions
        (date, medicinename, dosage, notes)
        VALUES(@date, @medicinename, @dosage, @notes);
    `
    let stmt = db.prepare<Omit<Prescription,'prescriptionID'>,Prescription>(sql)
    let result = stmt.run(body)

    if (result.changes === 0) {
        return c.json({ message: 'Prescription not created' },500)
    }
    let lastRowid = result.lastInsertRowid as number

    let sql2 = `SELECT * FROM prescriptions WHERE prescriptionID = ?`
    let stmt2 = db.prepare<[number],Prescription>(sql2)
    let newPrescription  = stmt2.get(lastRowid)
    return c.json({ message: 'Prescription created',data: newPrescription } ,201)
})


const updatePrescriptionSchema = z.object({
    date: z.string().min(5).optional(),
    medicinename: z.string().min(1).optional(),
    dosage: z.string().min(1).optional(),
    notes: z.string().optional(),
})
prescriptionRoutes.put('/:prescriptionID',
    zValidator('json', updatePrescriptionSchema),async (c) => {
    const { prescriptionID } = c.req.param()
    const body = await c.req.json()
    
    if (Object.keys(body).length === 0) {
        return c.json({ message: 'No fields to update' }, 400)
    }
    const exists = db.prepare('SELECT * FROM prescriptions WHERE prescriptionID = ?').get(prescriptionID)
    if (!exists) return c.json({ message: 'Prescription not found' }, 404)

    const sql = `
        UPDATE prescriptions SET
            date = COALESCE(@date, date),
            medicinename = COALESCE(@medicinename, medicinename),
            dosage = COALESCE(@dosage, dosage),
            notes = COALESCE(@notes, notes)
        WHERE prescriptionID = @prescriptionID
    `
    const stmt = db.prepare(sql)
    stmt.run({ ...body, prescriptionID })

    const updated = db.prepare('SELECT * FROM prescriptions WHERE prescriptionID = ?').get(prescriptionID)

    return c.json({ message: 'Prescription updated', data: updated })
    }
)

prescriptionRoutes.delete('/:prescriptionID', (c) => {
    const { prescriptionID } = c.req.param()

    const stmt = db.prepare('DELETE FROM prescriptions WHERE prescriptionID = ?')
    const result = stmt.run(prescriptionID)

    if (result.changes === 0) {
    return c.json({ message: 'Prescription not found' }, 404)
    }

    return c.json({ message: 'Prescription deleted', prescriptionID })
})

export default prescriptionRoutes