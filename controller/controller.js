// Контроллеры работают с роутами
import { userDatabase } from "../data/database.js";
import { findAllUsers, findUserByID } from "../models/model.js";

export const getAllUsers = async function (request, response) {
    try {
        let allUsersJson = await findAllUsers()
        response.writeHead(200, { 'content-type': 'application/json' })
        response.end(JSON.stringify(allUsersJson))
    } catch (error) {
        console.log(error)
    }
}

export const getUserByID = async function (request, response, id) {
    try {
        let userSearchResault = await findUserByID(id)
        if (userSearchResault === 'Invalid ID') {
            response.writeHead(400, { 'content-type': 'application/json' })
            response.end(JSON.stringify(userSearchResault))
        } else if (userSearchResault === 'User does not exist') {
            response.writeHead(404, { 'content-type': 'application/json' })
            response.end(JSON.stringify(userSearchResault))
        } else if (userSearchResault) {
            response.writeHead(200, { 'content-type': 'application/json' })
            response.end(JSON.stringify(userSearchResault))
        }
    } catch (error) {
        response.writeHead(500, { 'content-type': 'application/json' })
        response.end(JSON.stringify('Internal server error'))
        console.log(error)
    }
}

export const createNewUser = async function (request, resolve, userData) {
    try {

    } catch {

    }
}