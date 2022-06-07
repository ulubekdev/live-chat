import path from 'path'
import fs from 'fs'

export default (error, req, res, next) => {
    fs.appendFileSync(
        path.join(process.cwd(), 'error.log'),
        `${req.url}___${req.method}___${Date.now()}___${error.name}___${error.message}\n`
    )

    return res.status(500).json({
        status: 500,
        name: 'InternalServerError',
        message: 'Internal Server Error!'
    })
}