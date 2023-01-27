export default async ({ sequelize }) => {
    const user = await sequelize.models.User.findOne()
    if (!user) await sequelize.models.User.bulkCreate([
        {
            username: 'ali',
            password: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
            userimg: 'ali.jpg',
        },
        {
            username: 'nosir',
            password: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
            userimg: 'nosir.jpg',
        },
    ])

    const message = await sequelize.models.Message.findOne()
    if (!message) await sequelize.models.Message.bulkCreate([
        {
            message_from: 1,
            message_to: 2,
            message_content: 'Salom, Nosir!',
            message_type: 'plain/text',
        },
        {
            message_from: 2,
            message_to: 1,
            message_content: 'Salom, Ali! Qalaysan? Ahvollaring yaxshimi?',
            message_type: 'plain/text',
        },
    ])
}