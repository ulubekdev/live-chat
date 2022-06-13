export default async ({ io, socket, db }) => {
    try {
        socket.on('message-typing', async ({ to }) => {
            const user = await db.models.User.findOne({ where: { user_id: to } })
            io.to(user.socket_id).emit('message-typing', { to, from: socket.userId })
        })

        socket.on('message-stop', async ({ to }) => {
            const user = await db.models.User.findOne({ where: { user_id: to } })
            io.to(user.socket_id).emit('message-stop', { to, from: socket.userId })
        })

        socket.on('message-file', async ({ to }) => {
            const user = await db.models.User.findOne({ where: { user_id: to } })
            io.to(user.socket_id).emit('message-file', { to, from: socket.userId })
        })

    } catch (error) {
        socket.emit('message-error', error)
    }
}