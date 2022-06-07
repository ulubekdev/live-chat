import fs from 'fs/promises'
import path from 'path'

export default async ({ sequelize }) => {
    const modelsPath = path.join(process.cwd(), 'src', 'models')
    const dir = await fs.readdir(modelsPath)

    for await (let file of dir) {
        if (file === 'index.js') continue
        //if (file === 'relationship.js') continue

        const { default: Model } = await import('file://' + path.join(modelsPath, file))
        await Model({ sequelize })
    }

    //const { default: Model } = await import('file://' + path.join(modelsPath, 'relationship.js'))
    //await Model({ sequelize })
}