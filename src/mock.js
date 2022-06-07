export default async({ sequelize }) => {
    await sequelize.models.User.bulkCreate([
        {
            username: 'ali',
            password: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
            userimg: 'ali.jpg'
        },
        {
            username: 'lola',
            password: '20f3765880a5c269b747e1e906054a4b4a3a991259f1e16b5dde4742cec2319a',
            userimg: 'lola.jpg'
        }
    ]);

    // await sequelize.models.Message.bulkCreate([
    //     {
    //         message_from: 1,
    //         message_to: 2,
    //         message_content: 'Hello',
    //         message_type: 'plain/text'
    //     },
    //     {
    //         message_from: 2,
    //         message_to: 1,
    //         message_content: 'Hi',
    //         message_type: 'plain/text'
    //     }
    // ]);
}