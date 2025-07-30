import React from 'react'
import { Route, Routes } from 'react-router'
import ClassifierPage from './pages/ClassifierPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/"  element={<ClassifierPage />}/>

      </Routes>
    </div>
  )
}

export default App