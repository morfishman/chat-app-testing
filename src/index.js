const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io')

const Filter = require('bad-words')
const {genaratMassege, ganerateLocation} = require('./utiles/masseges')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {addUser,removUser,getUser,getUsersRoom} = require('./utiles/users')
const {notifier} = require('../public/notoficatons');
const { get } = require('https');
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))




io.on('connection', (socket)  => {
    console.log('connection made!')

    

    
    socket.on('join',({username, room}, callback) => {
        const {error,user} = addUser({id: socket.id , username,room})
        
        if (error) {
           return callback(error)
        }

        socket.join(user.room)

        socket.emit('Massege',genaratMassege('Admin',`Welcome ${user.username}`))
        socket.broadcast.to(user.room).emit('Massege', genaratMassege('Admin',`${user.username} has joined to room ${user.room}`))
        //for admin
        socket.broadcast.to('admin').emit('Massege', genaratMassege('assistent',`${user.username} has joined to room ${user.room}`))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users:getUsersRoom(user.room),
        })
        io.to('admin').emit('roomData',{
            room: user.room,
            users:getUsersRoom(user.room),
        })
        callback()
    })

    socket.on('SendMaeg', (data, callback) => {
        const filter = new Filter()

        if (filter.isProfane(data)){
            return callback('proffenaty is not allawed!')
        }
        const user = getUser(socket.id)
        io.to(user.room).emit('Massege',genaratMassege(user.username,data))
        io.to('admin').emit('Massege',genaratMassege(user.username,data+" room: "+user.room))
        callback()
    })

    socket.on('SendLocation', (data,callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMassege', ganerateLocation(user.username, `https://google.com/maps?q=${data.latitude},${data.longitude}`))
        io.to('admin').emit('locationMassege', ganerateLocation(user.username, `https://google.com/maps?q=${data.latitude},${data.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removUser(socket.id)

        if(user){
            io.to(user.room).emit('Massege', genaratMassege('Admin',`${user.username} disconnected form your room (${user.room})`))
            io.to('admin').emit('Massege', genaratMassege('assistent',`${user.username} disconnected form room (${user.room})`))
            io.to(user.room).emit('roomData', {
                room:user.room,
                users: getUsersRoom(user.room),
            })
        }

    })
})

server.listen(port, () => {
    console.log('on PORT', port)
    notifier
})