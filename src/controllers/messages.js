import { InternalServerError } from "../utils/errors";


const sendMessage = async(req, res) => {
    try {
        //
    } catch (error) {
        throw new InternalServerError(500, error.message);
    }

};

const getMessagesByUserId = async(req, res) => {
    try {
        //
    } catch (error) {
        throw new InternalServerError(500, error.message);
    }
}


export default {
    sendMessage,
    getMessagesByUserId
}