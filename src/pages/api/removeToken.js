import {prisma} from '../../../lib/prisma'

export default async function handler(req, res) {
    const {method} = req
    switch (method) {
        case 'POST':
            const {authToken} = req.body
            await prisma.user.update({
                where: {
                    authToken
                },
                data:{
                    authToken: " "
                }
            }).then(async (user) => {
                res.status(201).json(authToken)
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                })
            })
            break
        default:
            res.setHeader('Allow', ['POST'])
            break
    }
}
