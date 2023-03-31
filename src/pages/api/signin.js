import {prisma} from '../../../lib/prisma'
import { RandomHash } from 'random-hash'
import { randomBytes } from 'crypto'

export default async function handler(req, res) {
    const {method} = req
    const generateHash = new RandomHash({
        length: 253,
        charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
        rng: randomBytes
    });
    switch (method) {
        case 'POST':
            const {username, password, rememberMe} = req.body
            const user = await prisma.user.findFirst({
                where: {
                    username,
                    password
                }
            }).then(async (user) => {
                if({rememberMe}){
                    const hash = generateHash()
                    await prisma.user.update({
                        where:{
                            username
                        },
                        data:{
                            authToken: hash
                        }
                    })
                    res.status(201).json(hash)
                }
                
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                })
            })
            break
        default:
            res.setHeader('Allow', ['GET'])
            break
    }
}