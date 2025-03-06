import React from 'react'
import './App.css'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Service from './components/Services/Services'
import Registration from './components/Registration/Registration'

const App = () => {
  return (
    <>
      <Header />
      <Hero /> 
      <Service/>
      <Registration />
    </>
  )
}

export default App