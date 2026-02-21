import React from 'react'
import './App.css'

function App() {
  const [count, setCount] = React.useState(0)

  return (
    <>
      <div>
        <h1>Medical Assist</h1>
        <p>Добро пожаловать в Medical Assist</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
