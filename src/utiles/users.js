const users = []

const addUser = ({id, username, room}) => {
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data

    if(!username || !room) {
        return {
            error: 'username and room are requird'
        }
    }

    //check for existing user
    const existinguser = users.find((user) => user.room === room && user.username === username)

    //validate username
    if(existinguser){
        return{
            error: 'username is in use!'
        }

    }
    //store user
    const user = {id, username, room}
    users.push(user)
    return {user}
}


const removUser =(id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}


const getUser = (id) => users.find((user) => user.id === id)

const getUsersRoom = (room) => users.filter((user) => user.room === room)

module.exports = {
    addUser,
    removUser,
    getUser,
    getUsersRoom,
}

