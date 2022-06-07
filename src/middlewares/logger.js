import fs from 'fs';
import path from 'path';

export default (err, req, res) => {
    fs.appendFileSync(path.join(process.cwd(), 'error.log'), `${req.url}  ---  ${req.method}  ---  ${Date.now()}  ---  ${err.name}\n`);
    return res.status(500).json({
        status: 500,
        name: 'Internal Server Error',
        message: 'Something went wrong',
    });
};