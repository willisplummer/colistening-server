const http = require("http").Server()
const io = require("socket.io")(http)
const port = process.env.PORT || 4001

let data = {}
let count = 0

io.on("connection", socket => {
  count++
  const newUserName = `user-${count}`
  const newUser = { name: newUserName, currentPosition: 0 }
  console.log("New client connected", newUserName)
  data[newUserName] = newUser
  socket.emit("setName", newUserName)
  io.emit("updateListeners", Object.values(data))

  socket.on("data", ({ name, currentPosition }) => {
    console.log('updateCurrentPosition', name, currentPosition)
    data[name] = { name, currentPosition }
    socket.broadcast.emit("updateListeners", Object.values(data))
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected")
    // socket.leave(room)
    // todo: update the listeners to remove the one that disconnected
    // io.sockets.in(room).emit("updateListeners", )
  })
})

http.listen(port, () =>
  console.log(`Listening on port ${port}`)
)
