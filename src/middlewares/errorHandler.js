export default (err, req, res, next) => {
    if (err.status < 500) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
            name: err.name
        });
    } else {
        return next(err);
    }
};