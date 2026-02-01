import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { MENU } from '@/utils/constants';
import { useAuth } from '../context/AuthContext'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    if (isMenuOpen) toggleMenu();
  };

  const getAccountLink = () => {
    if (!isAuthenticated) return "/login";
    if (user?.roles.includes("ADMIN")) return "/admin/dashboard";
    return "/account/dashboard";
  };

  const accountButtonText = isAuthenticated ? (user?.username || "Мой кабинет") : "Войти";

  if (loading) {
    return (
        <header className="absolute top-0 left-0 z-50 w-full bg-[#070707]">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between min-h-[94px] gap-4">
                <Link to="/" className="relative z-10 shrink-0">
                    <img src={logo} alt="Logo" className="max-h-[50px] w-auto" />
                </Link>
                <div className="shrink-0">
                    <span className="text-white">Загрузка...</span>
                </div>
            </div>
        </header>
    );
  }

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-[#070707]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between min-h-[94px] gap-4">
        <Link to="/" className="relative z-10 shrink-0" onClick={isMenuOpen ? toggleMenu : undefined}>
          <img src={logo} alt="Logo" className="max-h-[50px] w-auto" />
        </Link>

        <div
          className={`md:hidden relative z-10 ml-auto w-[30px] h-[20px] ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className={`absolute left-0 w-full h-[2px] bg-white top-[9px] transition-all duration-300 ease-in-out ${isMenuOpen ? 'scale-0' : ''}`}></span>
          <span className={`absolute left-0 w-full h-[2px] bg-white transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 top-[9px]' : 'top-0'}`}></span>
          <span className={`absolute left-0 w-full h-[2px] bg-white transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 bottom-[9px]' : 'bottom-0'}`}></span>
        </div>


        <nav className={`md:flex-1 ${isMenuOpen ? 'fixed inset-0 bg-[#070707] pt-[100px] px-[10px] pb-[20px] overflow-auto' : 'hidden md:block'}`}>
          <ul className="md:flex md:justify-center md:gap-6 lg:gap-[40px]">
            {MENU.map(({ name, link }, index) => (
              <li key={index} className="md:mb-0 mb-5 text-center whitespace-nowrap">
                <Link
                  to={`/${link}`}
                  onClick={isMenuOpen ? toggleMenu : undefined}
                  className="text-white font-medium hover:text-[#007bff] transition-colors duration-300 md:text-sm lg:text-base text-2xl"
                >
                  {name}
                </Link>
              </li>
            ))}
            {isMenuOpen && isAuthenticated && (
                 <li className="md:hidden text-center whitespace-nowrap mt-8">
                    <button
                        onClick={handleLogout}
                        className="text-white font-medium hover:text-red-500 transition-colors duration-300 text-2xl"
                    >
                        Выйти
                    </button>
                </li>
            )}
          </ul>
        </nav>

        <div className="shrink-0 hidden md:flex items-center gap-4"> 
          <Link
            to={getAccountLink()}
            onClick={isMenuOpen ? toggleMenu : undefined}
            className="inline-block px-4 lg:px-5 py-2.5 text-white border border-white rounded-[15px] font-medium hover:bg-[#0056b3] transition-colors duration-300 relative z-10 whitespace-nowrap text-sm lg:text-base"
          >
            {accountButtonText}
          </Link>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="inline-block px-4 lg:px-5 py-2.5 text-white bg-red-600 border border-red-600 rounded-[15px] font-medium hover:bg-red-700 transition-colors duration-300 relative z-10 whitespace-nowrap text-sm lg:text-base"
            >
              Выйти
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
