const users = []

//adduser, removeUser, getuser, getUsersInRoom
const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if (!username || !room) {
        return {
            error: 'Username and room required!'
        }
    }

    //check for existing user 
    const existingUser = users.find((user) => {
            return user.room === room && user.username === username
        })
        //validate username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const user = users.filter((individual_user) => {
        return individual_user.room === room
    })
    return user
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


// addUser({
//     id: 33,
//     username: 'Adarsh',
//     room: 'siwan'
// })

// addUser({
//     id: 43,
//     username: 'POGO',
//     room: 'siwan'
// })

// addUser({
//     id: 44,
//     username: 'cheems',
//     room: 'kanpur'
// })

// console.log(users)

// const user = getUser(44)
// console.log(user)

// const userlist = getUsersInRoom('sijgwan')
// console.log(userlist)
//     // const removedUser = removeUser(33)
//     // console.log(removedUser)
//     // console.log(users)