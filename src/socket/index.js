import User from './user.js';
import Message from './message.js';

export default async({ io, db }) => {
    io.on('connection', async (socket) => {
        process.io = io;
        process.socket = socket;

        await User({ io, socket, db });
        await Message({ io, socket, db });
    });
}