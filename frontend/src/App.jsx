import React from 'react'
import './App.css'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Service from './components/Services/Services'
import Footer from './components/Footer/Footer'

const App = () => {
  return (
    <>
      <Header />
      <Hero /> 
      <Service />
      <Footer />
    </>
  )
}

export default App