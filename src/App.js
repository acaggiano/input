import React, { useState, useMemo } from 'react';
import './App.css';

const memoizedUnique = () => {
  // Function to simulate api. It is memoized to return the same response for the same input in a session
  const cache = {}
  return (name) => {
      const existing = cache[name]
      if (existing===undefined){
          const val = Math.random() < 0.5
          cache[name] = val
      }
      return new Promise((res, rej) => {
        if(Math.random() > 0.1) { //Simulate occasional failure
          res(cache[name])
        }
        else {
          rej()
        }
      })
  }
}

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => { func.apply(this, args); }, timeout)
  };
}

function App() {
  const [error, setError] = useState('')
  const api = useMemo(() => memoizedUnique(), [])
  return (
    <div className="App">
      <label>User Name: </label>
      <input 
        onKeyUp= {
          debounce((e) => {
            if(e.target.value.length < 4 && e.target.value.length > 0) {
              setError("Username must be at least 4 characters long")
            }
            else {
              setError("");
              api(e.target.value)
              .then(isUnique => {
                if(!isUnique) {
                  setError("Name is not unique")
                }
              })
              .catch((error) => setError("API Cannot be reached"))
            }
          }
        )}
      />
      {error ? <div>{error}</div>: null}
    </div>
  );
}

export default App;
