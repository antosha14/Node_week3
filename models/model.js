import { userDatabase } from "../data/database.js"
import { v4 as uuidv4, validate } from 'uuid'
//NVC Pattern 
// GET api/users
export const findAllUsers = function () {
    return new Promise((resolve, reject) => {
        resolve(userDatabase)
    })
}

export const findUserByID = function (id) {
    return new Promise((resolve, reject) => {
        let searchedUser = userDatabase.find(user => user.id === id)
        console.log(uuidv4())
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