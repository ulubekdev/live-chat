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
                model: 'users',
                key: 'user_id'
            }
        },
        message_to: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
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
}