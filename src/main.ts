import { createServer } from 'node:http'
import { getAllUsers, getUserByID, createNewUser, changeUser, deleteUser } from './controller/controller.js'
import * as dotenv from "dotenv"


dotenv.config({ path: './.env' })
const PORT = process.env.PORT || 8000


const server = createServer((request: any, response: any) => {
    // request.url вернет все что находится в ссылке после оригинального адреса monka.ru/omega вернет omega?
    if (request.url === "/api/users" && request.method === "GET") {
        getAllUsers(request, response)
    } else if (request.url.match(/\/api\/users\/.*/g) && request.method === 'GET') {
        let id = request.url.split('/')[3]
        getUserByID(request, response, id)
    } else if (request.url === '/api/users' && request.method === 'POST') {
        createNewUser(request, response)
    } else if (request.url.match(/\/api\/users\/.*/g) && request.method === 'PUT') {
        let id = request.url.split('/')[3]
        changeUser(request, response, id)
    } else if (request.url.match(/\/api\/users\/.*/g) && request.method === 'DELETE') {
        let id = request.url.split('/')[3]
        deleteUser(request, response, id)
    }
    else {
        response.writeHead(404, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ "message": "URL not supported" }))
    }
    //response.writeHead(200, {'Content-Type':'text/html'})
    response.statusCode = 200

}).listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })
