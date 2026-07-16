import express from 'express'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import router from './router'
import db from './config/db'

//Nos conectamos a la DB
export async function connectDB() {
    try {
        await db.authenticate()
        await db.sync()
        // console.log('Conexion exitosa a la DB')
    } catch (error) {
        console.log(error)
        console.log('Hubo un error al concectar a la DB')
    }
}

connectDB()

//Instacia de express
const server = express()

//Permitir conexiones
const corsOptions : CorsOptions = {
    origin: function(origin, callback){
        if(origin === process.env.FRONTEND_URL){
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

//Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))
server.use('/api/products', router)

//Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

export default server
