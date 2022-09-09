import './App.css';
import io from 'socket.io-client'
import {useEffect, useState} from 'react'
const socket = io.connect("http://localhost:3001")


function App() {
  const [room, setRoom] = useState('')

  const [currentRoom, setCurrentRoom] = useState('')

  const [message, setMessage] = useState('')

  const [messageReceived, setMessageReceived] = useState([])
  
  const joinRoom = () => {
    if(room !== "") {
      socket.emit("leave_room", currentRoom)
      socket.emit("join_room", room)
      setCurrentRoom(room)
    }
  }

  const sendMessage = () => {
    setMessageReceived(prev => [...prev, message])
    socket.emit("send_message", {message, room}) //room dipisah sesuai room yang ada
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageReceived(prev => [...prev, data.message])
    })
  }, [socket])


  return (
    <div className="App">
      <input placeholder='room number' onChange={(event) => {
        setRoom(event.target.value)
      }}/>
      <button onClick={joinRoom}>Join room</button>

      <input placeholder='message...' onChange={(event) => {
        setMessage(event.target.value)
      }}/>
      <button onClick={sendMessage}>Send message</button>
      <h1>Message:</h1>
      {messageReceived.map(message => {
        return <p>{message}</p>
      })}
    </div>
  );
}

export default App;
