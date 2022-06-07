export default async({ sequelize }) => {
    await sequelize.models.User.bulkCreate([
        {
            username: 'ali',
            password: '12345',
            userimg: 'ali.jpg'
        },
        {
            username: 'lola',
            password: '54321',
            userimg: 'lola.jpg'
        }
    ]);

    await sequelize.models.Message.bulkCreate([
        {
            message_from: 1,
            message_to: 2,
            message_content: 'Hello',
            message_type: 'plain/text'
        },
        {
            message_from: 2,
            message_to: 1,
            message_content: 'Hi',
            message_type: 'plain/text'
        }
    ]);
}