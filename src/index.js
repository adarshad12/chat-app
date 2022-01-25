// *** server side ***// 

const path = require('path') //node core module
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utills/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utills/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectorypath = path.join(__dirname, '../public')

app.use(express.static(publicDirectorypath))

// server (emit) --> client(recieve) -> countUpdated/message
// client (emit) --> server(recieve) -> increment

// let count = 0
//give a message when a client connects
io.on('connection', (socket) => {
    console.log('New Webserver Connection')

    // socket.emit('sendMessage', 'Hi! I am adarsh anand.')
    // socket.emit('countUpdated', count)
    // socket.on('increment', () => {
    // count++
    // // socket.emit('countUpdated', count) //emits single connection
    // io.emit('countUpdated', count) //emits to all connections
    // })


    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        //socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit, socket.broadcast.to.emit


        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
            // io.emit('message', `Location ${location.latitude} , ${location.longitude}`)
        io.to(user.room).emit('locationMessage',
            generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })
})


server.listen(port, () => {
    console.log('server is up on the ' + port)
})