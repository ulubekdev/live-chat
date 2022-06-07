export default ({ sequelize }) => {
    return (req, res, next) => {
        req.models = sequelize.models
        next();
    }
}