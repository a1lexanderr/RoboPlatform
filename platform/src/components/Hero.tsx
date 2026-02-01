import React from 'react'
import heroImage from '../assets/images/hero.svg'

const Hero: React.FC = () => {
  return (
    <section className="bg-gray-100 pt-[94px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Добро пожаловать на нашу платформу
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
              Присоединяйтесь к нашему сообществу и получите доступ к эксклюзивным соревнованиям, 
              архивам и новостям из мира спорта.
            </p>
            <div>
              <a 
                href="/signup" 
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg"
              >
                Зарегистрироваться
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <img 
              src={heroImage} 
              alt="Hero" 
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              style={{maxHeight: '500px'}} 
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero