import { v4 as uuidv4, validate } from 'uuid'
import { readFile } from 'fs/promises'
import { userDatabaseUpdater } from '../utils.js'
//NVC Pattern 


let userDatabase = JSON.parse(
    await readFile(
        new URL('../data/database.json', import.meta.url),
        { encoding: 'utf-8' }
    )
)

export const findAllUsers = function () {
    return new Promise((resolve, reject) => {
        resolve(userDatabase)
    })
}

export const findUserByID = function (id) {
    return new Promise((resolve, reject) => {
        let searchedUser = userDatabase.find(user => user.id === id)
        if (!validate(id)) {
            resolve('Invalid ID')
        }
        else if (searchedUser) {
            resolve(searchedUser)
        }
        else {
            resolve('User does not exist')
        }
    })
}

//Парсит реквест и резолвит промис со стрингом ошибки или с объектом. Далее в основной функции мы его либо пушим в базу либо Кидаем резолв с ошибкой
const userValidityChecker = function (request) {
    return new Promise((resolve, reject) => {
        try {
            let requestBody = ''

            request.on('data', (chunk) => {
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
export const userAdder = async function (request) {
    let userValidityCheckResault = await userValidityChecker(request)
    return new Promise((resolve, reject) => {
        if (userValidityCheckResault === 'Inputed params are not valid') {
            resolve(userValidityCheckResault)
        } else if (userValidityCheckResault === 'Internal server error') {
            resolve(userValidityCheckResault)
        } else if (typeof userValidityCheckResault === 'object') {
            // Странно в туториале обновляют сразу весь файл, это не совсем валидно. Если будет время РЕФАКТОРНУТЬ В ДОПОЛНЕНИЯ
            userDatabase.push(userValidityCheckResault)
            console.log(userDatabase)
            userDatabaseUpdater(userDatabase)
            resolve(userValidityCheckResault)
        }
    })
}

//Блин мне не обязательно ретернить промисы потому что асинк функция сама по себе ретернит промис
export const userDeleter = async function (request) {
    return new Promise((resolve, reject) => {

    })
}
