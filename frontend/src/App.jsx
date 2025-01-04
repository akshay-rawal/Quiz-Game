import React from 'react'
import { Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/home/Home'
import CategoryPage from './components/Categorypages'
import Leaderboard from './components/LeaderBoard'

const App = () => {
  return (
   
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/signup" element={<Signup />} />
    
      <Route path="/home" element={<Home />} />
      <Route path="/questions/:category" element={<CategoryPage/>} />
      <Route path='/leaderboard' element={<Leaderboard/>}/>

    </Routes>
   

  )
}

export default App