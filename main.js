import { createServer } from 'node:http'
import { getAllUsers, getUserByID } from './controller/controller.js'

const PORT = process.env.PORT || 5000
const data = {
    'omega': true,
    'ebaka': "Monka-omega"
}

const server = createServer((request, response) => {
    // request.url вернет все что находится в ссылке после оригинального адреса monka.ru/omega вернет omega?
    if (request.url === "/api/users" && request.method === "GET") {
        getAllUsers(request, response)
    } else if (request.url.match(/\/api\/users\/.*/g) && request.method === 'GET') {
        let id = request.url.split('/')[3]
        getUserByID(request, response, id)
    } else if (request.url === '/api/users' && request.method === 'POST') {

    } else if (request.url === 'api/users/*' && request.method === 'PUT') {

    } else if (request.url === 'api/users/*' && request.method === 'DELETE') {

    }
    else {
        response.writeHead(404, { 'Content-Type': 'application/json' })
        response.end('Роут не найден')
    }
    //response.writeHead(200, {'Content-Type':'text/html'})
    response.statusCode = 200

})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))