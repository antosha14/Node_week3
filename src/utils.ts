import { writeFile } from 'fs'

export const userDatabaseUpdater = async function (content: object) {
    writeFile('./data/database.json', JSON.stringify(content), (err) => {
        if (err) return 'Internal server error'
    })
}   