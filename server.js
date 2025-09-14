const express = require('express')
const app = express()
const server = require('http').Server(app) 
const io = require('socket.io')(server)
 

app.set('view engine', 'ejs')
 
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('home')
})
app.get('/join-room',(req,res)=>{
  const roomid=req.query.id
  res.redirect(`/join-room${roomid}`)
})
app.get('/join-room:id', (req, res) => {
  res.render('room',{roomId: req.params.id})
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})
server.listen(4000,()=>{
  console.log("running")
});
 