import { useState } from 'react'
import Pages from '../Pages'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <><Pages/></>
  )
}

export default App
