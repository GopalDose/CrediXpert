import React from 'react'
import './App.css'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Service from './components/Services/Services'
import Registration from './components/Registration/Registration'
import Footer from './components/Footer/Footer'

const App = () => {
  return (
    <>
      <Header />
      <Hero /> 
      <Service/>
      <Registration />
      <Footer />
    </>
  )
}

export default App