import JWT from '../utils/jwt.js';

export default async ({ io, socket, db }) => {
    try {
        let token = socket.handshake.auth.token.trim();
        if(!token) {
            socket.emit('user-exit');
        }

        let { user_id, agent } = JWT.verify(token);
        if(agent !== socket.handshake.headers['user-agent']) {
            socket.emit('user-exit');
        }

        const user = await db.models.User.findOne({
            where: {
                user_id
            }
        });

        if(!user) {
            socket.emit('user-exit');
        }

        socket.userId = user_id;
        await db.models.User.update({
            socket_id: socket.id
        }, { where: { user_id } } );

        socket.broadcast.emit('user-online', user);

        socket.on('disconnect', async () => {
            await db.models.User.update({ socket_id: null }, { where: { user_id } } );
            socket.broadcast.emit('user-offline', user);
        })
    } catch (error) {
        socket.emit('user-exit');
    }
}