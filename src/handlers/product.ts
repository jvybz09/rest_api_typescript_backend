import { Request, Response } from 'express'
//Importamos express-validator - para validar en la DB
//import { check, validationResult } from 'express-validator'
//Para insertar en la DB, importamos el modelo
import Product from '../models/Product.model'

export const getProducts = async(req: Request, res: Response) => {
    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
    res.json({data: products})
}

export const getProductById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    res.json({data: product})
}

export const createProduct = async (req: Request, res: Response) => {
    //Validacion
    // await check('name')
    //     .notEmpty()
    //     .withMessage('El nombre del producto no puede ir vacio')
    //     .run(req)

    // await check('price')
    //     .isNumeric().withMessage('Valor no valido')
    //     .notEmpty().withMessage('El precio del producto no puede ir vacio')
    //     .custom(value => value > 0).withMessage('El valor del precio no es valido')
    //     .run(req)

    //Lo almacenamos en la DB
    const product = await Product.create(req.body)
    res.status(201).json({data: product})
}

export const updateProduct = async (req:Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    //Procede a actualizar
    await product.update(req.body)
    //Lo almacenamos
    await product.save()

    res.json({data: product})
}

export const updateAvailability = async (req:Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    //Procede a actualizar
    product.availability = !product.dataValues.availability
    //Lo almacenamos
    await product.save()

    res.json({data: product})
}

export const deleteProduct = async(req: Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await Product.findByPk(id)

    if(!product){
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    await product.destroy()
    res.json({data: 'Producto eliminado'})

}
