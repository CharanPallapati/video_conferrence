const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const videoGrid_Me = document.getElementById('video-grid-me')
const myPeer = new Peer(undefined, {
  port:443,
  secure: true,
  path: '/'
})

const myVideo = document.createElement('video')
myVideo.classList.add("our-sys")
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => 
{

  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    video.classList.add("remote-sys")
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
      video.remove()
  })
})

 

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  video.classList.add("remote-sys")
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  
    video.play()
  
   
    videoGrid.append(video)
  
}