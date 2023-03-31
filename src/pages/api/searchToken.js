import {prisma} from '../../../lib/prisma'

export default async function handler(req, res) {
    const {method} = req
    switch (method) {
        case 'POST':
            const {authToken} = req.body
            const user = await prisma.user.findFirst({
                where: {
                    authToken
                }
            }).then(user => {
                res.status(201).json(user)
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                })
            })
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
}
}