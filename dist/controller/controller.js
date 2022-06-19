// Контроллеры работают с роутами
import { findAllUsers, findUserByID, userAdder, userDeleter, userChanger } from "../models/model.js";
import { userDatabase } from "../models/model.js";
export const getAllUsers = async function (request, response) {
    try {
        let allUsersJson = await findAllUsers();
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify(allUsersJson));
    }
    catch (error) {
        response.end(JSON.stringify({ "message": "Internal server error" }));
    }
};
export const getUserByID = async function (request, response, id) {
    if (userDatabase.length < 1) {
        response.writeHead(500, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ "message": "Database is empty" }));
    }
    else {
        try {
            let userSearchResault = await findUserByID(id);
            if (userSearchResault === 'Invalid ID') {
                response.writeHead(400, { 'content-type': 'application/json' });
                response.end(JSON.stringify({ "message": "Invalid ID" }));
            }
            else if (userSearchResault === 'User does not exist') {
                response.writeHead(404, { 'content-type': 'application/json' });
                response.end(JSON.stringify({ "message": "User does not exist" }));
            }
            else if (userSearchResault) {
                response.writeHead(200, { 'content-type': 'application/json' });
                response.end(JSON.stringify(userSearchResault));
            }
        }
        catch (error) {
            response.writeHead(500, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ "message": "Internal server error" }));
        }
    }
};
export const createNewUser = async function (request, response) {
    try {
        let userAddingResault = await userAdder(request);
        if (userAddingResault === 'Inputed params are not valid') {
            response.writeHead(400, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ "message": "Inputed params are not valid" }));
        }
        else if (userAddingResault === 'Internal server error') {
            response.writeHead(500, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ "message": "Internal server error" }));
        }
        else if (typeof userAddingResault === 'object') {
            response.writeHead(201, { 'content-type': 'application/json' });
            response.end(JSON.stringify(userAddingResault));
        }
    }
    catch {
        response.writeHead(500, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ "message": "Internal server error" }));
    }
};
export const deleteUser = async function (request, response, id) {
    if (userDatabase.length < 1) {
        response.writeHead(500, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ "message": "Database is empty, nothing to delete" }));
    }
    else {
        try {
            let userDeleterResault = await userDeleter(id);
            if (userDeleterResault === 'Invalid ID') {
                response.writeHead(400, { 'content-type': 'application/json' });
                response.end(JSON.stringify({ "message": "Invalid ID" }));
            }
            else if (userDeleterResault === 'User does not exist') {
                response.writeHead(404, { 'content-type': 'application/json' });
                response.end(JSON.stringify({ "message": "User does not exist" }));
            }
            else if (userDeleterResault === 'User was found and deleted') {
                response.writeHead(204, { 'content-type': 'application/json' });
                response.end(JSON.stringify(userDeleterResault));
            }
            else if (userDeleterResault === 'Internal server error') {
                response.writeHead(500, { 'content-type': 'application/json' });
                response.end(JSON.stringify({ "message": "Internal server error" }));
            }
        }
        catch {
            response.writeHead(500, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ "message": "Internal server error" }));
        }
    }
};
export const changeUser = async function (request, response, id) {
    if (userDatabase.length < 1) {
        response.writeHead(500, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ "message": "Database is empty, nothing to change" }));
    }
    else {
        try {
            let userChangeResault = await userChanger(request, id);
            if (userChangeResault === 'Invalid ID') {
                response.writeHead(400, { 'content-type': 'application/json' });
                response.end(JSON.stringify({ "message": "Invalid ID" }));
            }
            else if (userChangeResault === 'Internal server error') {
                response.writeHead(500, { 'content-type': 'application/json' });
                response.end(JSON.stringify({ "message": "Internal server error" }));
            }
            else if (userChangeResault === 'User does not exist') {
                response.writeHead(404, { 'content-type': 'application/json' });
                response.end(JSON.stringify({ "message": "User does not exist" }));
            }
            else if (typeof userChangeResault === 'object') {
                response.writeHead(201, { 'content-type': 'application/json' });
                response.end(JSON.stringify(userChangeResault));
            }
        }
        catch {
            response.writeHead(500, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ "message": "Internal server error" }));
        }
    }
};
