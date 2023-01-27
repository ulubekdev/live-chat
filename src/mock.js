export default async ({ sequelize }) => {
    const user = await sequelize.models.User.findOne()
    if (!user) await sequelize.models.User.bulkCreate([
        {
            username: 'ali',
            userImg: 'ali.png',
            password: 'olma',
        },
        {
            username: 'nosir',
            userImg: 'nosir.jpg',
            password: 'olma',
        },
        {
            username: 'hikmat',
            userImg: 'hikmat.jpg',
            password: 'olma',
        }
    ])

    const message = await sequelize.models.Message.findOne()
    if (!message) await sequelize.models.Message.bulkCreate([
        {
            messageFrom: 1,
            messageTo: 2,
            messageBody: 'Salom, Nosir!',
            messageType: 'plain/text',
        },
        {
            messageFrom: 2,
            messageTo: 1,
            messageBody: 'Salom, Ali! Qalaysan? Ahvollaring yaxshimi?',
            messageType: 'plain/text',
        },
        {
            messageFrom: 1,
            messageTo: 2,
            messageBody: 'Ha yaxshiman. Anavi videoini ko\'rdingmi?',
            messageType: 'plain/text',
        },
        {
            messageFrom: 1,
            messageTo: 2,
            messageBody: 'kalyan.mp4',
            messageType: 'video/mp4',
        },
        {
            messageFrom: 2,
            messageTo: 3,
            messageBody: 'Darga borasanmi, Hikmat?',
            messageType: 'plain/text',
        },
        {
            messageFrom: 3,
            messageTo: 2,
            messageBody: 'Yo\'q bormayman.',
            messageType: 'plain/text',
        },
        {
            messageFrom: 3,
            messageTo: 1,
            messageBody: 'CS Go o\'ynaymizmi?',
            messageType: 'plain/text',
        },
        {
            messageFrom: 1,
            messageTo: 3,
            messageBody: 'Yo\'q, darsga borishim kerak!',
            messageType: 'plain/text',
        }
    ])
}