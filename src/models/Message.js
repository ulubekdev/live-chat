import { DataTypes } from "sequelize";

export default ({ sequelize }) => {
    sequelize.define("Message", {
        message_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        message_from: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User",
                key: "user_id"
            }
        },
        message_to: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User",
                key: "user_id"
            }
        },
        message_content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message_type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
        tableName: 'messages'
    })


    await sequelize.models.User.hasMany(sequelize.models.Message, {
        foreignKey: 'message_from'
    })

    await sequelize.models.User.hasMany(sequelize.models.Message, {
        foreignKey: 'message_to'
    })

    await sequelize.models.Message.belongsTo(sequelize.models.User, {
        foreignKey: 'message_from'
    })

    await sequelize.models.Message.belongsTo(sequelize.models.User, {
        foreignKey: 'message_to'
    })
}