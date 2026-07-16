import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {
    it('should display validation errors', async () => {
        const resposne = await request(server).post('/api/products').send({})
        expect(resposne.status).toBe(400)
        expect(resposne.body).toHaveProperty('errors')
        expect(resposne.body.errors).toHaveLength(4)

        expect(resposne.status).not.toBe(404)
        expect(resposne.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async () => {
        const resposne = await request(server).post('/api/products').send({
            name: 'Teclado - Testing',
            price: 0
        })
        expect(resposne.status).toBe(400)
        expect(resposne.body).toHaveProperty('errors')
        expect(resposne.body.errors).toHaveLength(1)

        expect(resposne.status).not.toBe(404)
        expect(resposne.body.errors).not.toHaveLength(2)
    })

    it('should create a new product', async () => {
        const resposne = await request(server).post('/api/products').send({
            name: "Monitor - Testing",
            price: 50
        })


        expect(resposne.status).toBe(201)
        expect(resposne.body).toHaveProperty('data')

        expect(resposne.status).not.toBe(404)
        expect(resposne.status).not.toBe(200)
        expect(resposne.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products', () => {
    it('Should check if api/products url exist', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })

    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')

        //Que esperamos
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        //Lo que no esperamos
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)

        //Lo que esperamos
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')
    })

    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no Valido')
    })

    it('Get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server)
                .put('/api/products/not-valid-url')
                .send({
                    name: "Teclado Mecánico - Testing",
                    availability:true,
                    price: 300
                })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no Valido')
    })

    it('Should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})

        //Lo que esperamos
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should validate that the price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "Teclado Mecánico - Testing",
            availability:true,
            price: 0
        })

        //Lo que esperamos
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('El valor del precio no es valido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should return a 404 response for a non-exist product', async () => {
        const productId = 2000
        const response = await request(server)
                .put(`/api/products/${productId}`)
                .send({
                    name: "Teclado Mecánico - Testing",
                    availability:true,
                    price: 300
                })

        //Lo que esperamos
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should update an existing product with vaild data', async () => {        
        const response = await request(server)
                .put('/api/products/1')
                .send({
                    name: "Teclado Mecánico - Testing",
                    availability:true,
                    price: 300
                })

        //Lo que esperamos
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('Should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)

        //Lo que esperamos
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        //Lo que no esperamos
        expect(response.status).not.toBe(200)
        expect(response.body.error).not.toHaveProperty('data')
    })

    it('Should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')
        //Lo que esperamos
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        //Lo que no esperamos
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('Should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')

        //Lo que esperamos
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no Valido')
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        //Lo que esperamos
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
    })

    it('Should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto eliminado')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})
