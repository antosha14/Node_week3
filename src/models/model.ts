import { v4 as uuidv4, validate } from 'uuid'
import { readFile } from 'fs/promises'
import { userDatabaseUpdater } from '../utils.js'
//NVC Pattern 

export let userDatabase: any = ''
try {
    userDatabase = JSON.parse(
        await readFile(
            new URL('../data/database.json', import.meta.url),
            { encoding: 'utf-8' }
        )
    )
} catch {

}

export const findAllUsers = function () {
    return new Promise((resolve, reject) => {
        resolve(userDatabase)
    })
}

export const findUserByID = function (id: string) {
    return new Promise((resolve, reject) => {
        if (userDatabase.length > 0) {
            let searchedUser = userDatabase.find((user: any) => user.id === id)
            if (!validate(id)) {
                resolve('Invalid ID')
            }
            else if (searchedUser) {
                resolve(searchedUser)
            }
            else {
                resolve('User does not exist')
            }
        } else {
            resolve('User does not exist')
        }
    })
}

//Парсит реквест и резолвит промис со стрингом ошибки или с объектом. Далее в основной функции мы его либо пушим в базу либо Кидаем резолв с ошибкой
const userValidityChecker = function (request: any) {
    return new Promise((resolve, reject) => {
        try {
            let requestBody = ''

            request.on('data', (chunk: any) => {
                requestBody += chunk.toString()
            })

            request.on('end', () => {
                try {
                    let jsonRequestBody = JSON.parse(requestBody)
                    // Это точно можно было разделить чтобы читалось лучше но пока оставлю так, мейби дойдут руки зарефакторить
                    // В общем каждая строка проверяет наличие и валидность каждого поля
                    // Плюс не было указано, что юзернэйм должен быть уникальным
                    if ('username' in jsonRequestBody && typeof jsonRequestBody.username === 'string' &&
                        'age' in jsonRequestBody && typeof jsonRequestBody.age === 'number' &&
                        'hobbies' in jsonRequestBody && Array.isArray(jsonRequestBody.hobbies)) {
                        let newUser = {
                            id: uuidv4(),
                            username: jsonRequestBody.username,
                            age: jsonRequestBody.age,
                            hobbies: jsonRequestBody.hobbies
                        }
                        resolve(newUser)
                    } else {
                        resolve('Inputed params are not valid')
                    }
                }
                catch (err) {
                    resolve('Inputed params are not valid')
                }
            })
        }
        catch (err) {
            console.log(err)
            resolve('Internal server error')
        }
    })
}

// Блин с условиями получается какое-то задвоение проверок промисов!!
export const userAdder = async function (request: any) {
    let userValidityCheckResault = await userValidityChecker(request)
    return new Promise((resolve, reject) => {
        if (typeof userValidityCheckResault !== 'object') {
            resolve(userValidityCheckResault)
        } else {
            // Странно в туториале обновляют сразу весь файл, это не совсем валидно. Если будет время РЕФАКТОРНУТЬ В ДОПОЛНЕНИЯ
            userDatabase.push(userValidityCheckResault)
            userDatabaseUpdater(userDatabase)
            resolve(userValidityCheckResault)
        }
    })
}

//Блин мне не обязательно ретернить промисы потому что асинк функция сама по себе ретернит промис
export const userDeleter = async function (id: string) {
    let validityCheckForDelition = await findUserByID(id)
    return new Promise((resolve, reject) => {
        try {
            if (typeof validityCheckForDelition === 'object') {
                userDatabase = userDatabase.filter((user: any) => user.id !== id)
                userDatabaseUpdater(userDatabase)
                resolve('User was found and deleted')
            } else {
                resolve(validityCheckForDelition)
            }
        } catch {
            resolve('Internal server error')
        }
    })
}

export const userChanger = async function (request: any, id: string) {
    let validityCheckForChange: any = await findUserByID(id)
    return new Promise((resolve, reject) => {
        if (typeof validityCheckForChange != 'object') {
            resolve(validityCheckForChange)
        } else {
            let requestBody = ''

            request.on('data', (chunk: any) => {
                requestBody += chunk.toString()
            })

            request.on('end', () => {
                try {
                    let jsonRequestBody = JSON.parse(requestBody)
                    if (jsonRequestBody) {
                        let updatedUser = {
                            id: validityCheckForChange.id,
                            username: typeof jsonRequestBody?.username === 'string' ? jsonRequestBody.username : false || validityCheckForChange.username,
                            age: typeof jsonRequestBody?.age === 'number' ? jsonRequestBody.age : false || validityCheckForChange.age,
                            hobbies: Array.isArray(jsonRequestBody?.hobbies) ? jsonRequestBody.hobbies : false || validityCheckForChange.hobbies
                        }
                        userDatabase = userDatabase.filter((user: any) => user.id !== validityCheckForChange.id)
                        userDatabase.push(updatedUser)
                        console.log(userDatabase)
                        userDatabaseUpdater(userDatabase)
                        resolve(updatedUser)
                    } else {
                        resolve('Inputed params are not valid')
                    }
                } catch (error) {
                    console.log(error)
                    resolve('Internal server error')
                }
            })
        }
    })
}

