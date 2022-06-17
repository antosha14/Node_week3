// Контроллеры работают с роутами
import { findAllUsers, findUserByID, userAdder, userDeleter } from "../models/model.js";

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
    }
}

export const createNewUser = async function (request, response) {
    let userAddingResault = await userAdder(request)
    if (userAddingResault === 'Inputed params are not valid') {
        response.writeHead(400, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userAddingResault))
    } else if (userAddingResault === 'Internal server error') {
        response.writeHead(500, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userAddingResault))
    } else if (typeof userAddingResault === 'object') {
        response.writeHead(201, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userAddingResault))
    }
}

export const deleteUser = async function (request, response, id) {
    let userDeleterResault = await userDeleter(id)
    if (userDeleterResault === 'Invalid ID') {
        response.writeHead(400, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userDeleterResault))
    } else if (userDeleterResault === 'User does not exist') {
        response.writeHead(404, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userDeleterResault))
    } else if (userDeleterResault === 'User was found and deleted') {
        response.writeHead(204, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userDeleterResault))
    } else if (userDeleterResault === 'Internal server error') {
        response.writeHead(500, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userDeleterResault))
    }
}

export const changeUser = async function (request, response, id) {
    let userChangeResault = await userChanger(request, id)
    if (userChangeResault === 'User ID is invalid') {
        response.writeHead(400, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userChangeResault))
    } else if (userChangeResault === 'Internal server error') {
        response.writeHead(500, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userChangeResault))
    }
    else if (userChangeResault === 'User does not exist') {
        response.writeHead(404, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userChangeResault))
    } else if (userChangeResault === 'User updated') {
        response.writeHead(201, { 'content-type': 'application/json' })
        response.end(JSON.stringify(userChangeResault))
    }
}