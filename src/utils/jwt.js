import JWT from 'jsonwebtoken'

export default {
    sign: payload => JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }),
    verify: token => JWT.verify(token, process.env.JWT_SECRET),
}