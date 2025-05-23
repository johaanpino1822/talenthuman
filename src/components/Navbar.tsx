import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, LogIn, User, Menu, X, ChevronDown, ChevronUp, Home, Mail, Settings, LogOut, Star, Award, Users, Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../image/logo1.png';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const profileRef = useRef(null);
  const controls = useAnimation();
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Paleta de colores basada en #051e56
  const primaryColor = '#051e56';
  const secondaryColor = '#1a3a8f';
  const accentColor = '#4a7cff';
  const lightAccent = '#a8c2ff';
  const textOnDark = '#f8fafc';

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    setActiveLink(location.pathname);
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const navLinks = [
    { path: "/", name: "Inicio", icon: <Home className="h-5 w-5" /> },
    { path: "/jobs", name: "Vacantes", icon: <Briefcase className="h-5 w-5" /> },
    { path: "/about", name: "Sobre Nosotros", icon: <Users className="h-5 w-5" /> },
    { path: "/contact", name: "Contacto", icon: <Mail className="h-5 w-5" /> },
  ];

  const profileLinks = [
    { path: "/profile", name: "Mi Perfil", icon: <User className="h-4 w-4" /> },
    { path: "/notifications", name: "Notificaciones", icon: <Bell className="h-4 w-4" />, badge: notificationCount },
    { path: "/achievements", name: "Logros", icon: <Award className="h-4 w-4" /> },
    { path: "/admin/dashboard", name: "Panel Admin", icon: <Settings className="h-4 w-4" /> },
    { path: "/help", name: "Ayuda", icon: <HelpCircle className="h-4 w-4" /> },
    { action: handleLogout, name: "Cerrar Sesión", icon: <LogOut className="h-4 w-4" /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  const linkHoverVariants = {
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 10 
      } 
    },
    tap: { 
      scale: 0.95,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 10 
      } 
    }
  };

  const logoVariants = {
    hover: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror"
      }
    },
    tap: {
      scale: 0.9,
      rotate: [0, 2, -2, 0]
    }
  };

  return (
    <>
      <nav 
        ref={ref}
        className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}
        style={{ 
          backgroundColor: scrolled ? `${primaryColor}e6` : primaryColor,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="flex items-center justify-between h-20"
          >
            {/* Logo */}
            <motion.div 
              whileHover="hover"
              whileTap="tap"
              variants={logoVariants}
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div 
                  className="relative h-12 w-12"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-xl shadow-lg transform rotate-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${lightAccent}, ${accentColor})` }}
                  ></div>
                  <div 
                    className="absolute inset-0 rounded-xl shadow-lg transform -rotate-6 opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${lightAccent}, ${accentColor})` }}
                  ></div>
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="relative h-full w-full object-contain drop-shadow-lg"
                  />
                </motion.div>
                <span 
                  className={`font-bold text-2xl ${scrolled ? 'drop-shadow-lg' : 'drop-shadow-2xl'} transition-all duration-300`}
                  style={{ 
                    color: textOnDark,
                    textShadow: `0 2px 4px rgba(0, 0, 0, 0.3)`
                  }}
                >
                  New Talent Human
                </span>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  variants={linkHoverVariants}
                  onHoverStart={() => setHoveredLink(link.path)}
                  onHoverEnd={() => setHoveredLink(null)}
                >
                  <Link
                    to={link.path}
                    className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300`}
                    style={{
                      color: activeLink === link.path ? textOnDark : lightAccent,
                      backgroundColor: activeLink === link.path ? `${secondaryColor}80` : 'transparent',
                      border: activeLink === link.path ? `1px solid ${accentColor}30` : 'none'
                    }}
                  >
                    <motion.span 
                      className={`transition-all duration-300 ${activeLink === link.path || hoveredLink === link.path ? 'text-cyan-300' : ''}`}
                      animate={{
                        scale: activeLink === link.path ? [1, 1.1, 1] : 1
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      {link.icon}
                    </motion.span>
                    <span className="font-medium">{link.name}</span>
                    {(activeLink === link.path || hoveredLink === link.path) && (
                      <motion.span 
                        className="absolute -bottom-1 left-1/2 w-4/5 h-0.5 rounded-full"
                        style={{ background: `linear-gradient(90deg, ${lightAccent}, ${accentColor})` }}
                        initial={{ width: 0, x: '-50%' }}
                        animate={{ width: '80%', x: '-50%' }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated ? (
                <motion.div 
                  variants={itemVariants}
                  className="relative flex items-center space-x-3"
                >
                  {/* Notifications */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: `${secondaryColor}80`,
                      border: `1px solid ${accentColor}30`,
                      color: lightAccent
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <motion.span 
                        className="absolute -top-1 -right-1 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#ef4444' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 500,
                          damping: 15
                        }}
                      >
                        {notificationCount}
                      </motion.span>
                    )}
                  </motion.button>

                  {/* Profile Menu */}
                  <div className="relative" ref={profileRef}>
                    <motion.button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                        border: `1px solid ${accentColor}30`,
                        color: textOnDark
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <motion.div 
                        className="h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold shadow-sm relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${lightAccent}, ${accentColor})` }}
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%']
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <span className="relative z-10">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                        <div 
                          className="absolute inset-0 animate-pulse"
                          style={{ background: `linear-gradient(135deg, ${lightAccent}30, ${accentColor}30)` }}
                        ></div>
                      </motion.div>
                      <span className="font-medium">{user?.name || 'Usuario'}</span>
                      {profileMenuOpen ? (
                        <ChevronUp className="h-5 w-5 transition-transform" />
                      ) : (
                        <ChevronDown className="h-5 w-5 transition-transform" />
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {profileMenuOpen && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={menuVariants}
                          className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl shadow-2xl overflow-hidden z-50"
                          style={{
                            backgroundColor: secondaryColor,
                            border: `1px solid ${accentColor}30`
                          }}
                        >
                          <div 
                            className="px-4 py-3 border-b"
                            style={{ borderColor: `${accentColor}30` }}
                          >
                            <p 
                              className="text-xs font-medium"
                              style={{ color: lightAccent }}
                            >
                              Sesión iniciada como
                            </p>
                            <p 
                              className="text-sm font-medium truncate"
                              style={{ color: textOnDark }}
                            >
                              {user?.email || 'usuario@ejemplo.com'}
                            </p>
                          </div>
                          <div 
                            className="py-1 divide-y"
                            style={{ borderColor: `${accentColor}30` }}
                          >
                            {profileLinks.map((item) => (
                              item.path ? (
                                <motion.div
                                  key={item.path}
                                  whileHover={{ 
                                    backgroundColor: `${accentColor}20`,
                                    x: 5
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="relative"
                                >
                                  <Link
                                    to={item.path}
                                    className="flex items-center justify-between px-4 py-3 text-sm transition-all duration-200"
                                    style={{ color: textOnDark }}
                                    onClick={() => setProfileMenuOpen(false)}
                                  >
                                    <div className="flex items-center">
                                      <span style={{ color: lightAccent }}>
                                        {item.icon}
                                      </span>
                                      <span className="ml-3">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                      <span 
                                        className="text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: '#ef4444' }}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </Link>
                                </motion.div>
                              ) : (
                                <motion.button
                                  key={item.name}
                                  onClick={item.action}
                                  className="w-full flex items-center px-4 py-3 text-sm transition-all duration-200"
                                  style={{ color: textOnDark }}
                                  whileHover={{ 
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    x: 5
                                  }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <span style={{ color: '#ef4444' }}>{item.icon}</span>
                                  <span className="ml-3">{item.name}</span>
                                </motion.button>
                              )
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                      color: textOnDark
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      <LogIn className="h-5 w-5 mr-2" />
                      <span>Acceso Admin</span>
                    </span>
                    <span 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${lightAccent}, ${accentColor})` }}
                    ></span>
                    <span 
                      className="absolute inset-0 border-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ borderColor: `${textOnDark}30` }}
                    ></span>
                  </Link>
                </motion.div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <motion.button 
              variants={itemVariants}
              className="lg:hidden p-2 rounded-xl focus:outline-none transition-all duration-300"
              style={{
                backgroundColor: `${secondaryColor}80`,
                color: textOnDark
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: `${secondaryColor}`
              }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </motion.button>
          </motion.div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-0 z-40 pt-24 pb-12 px-6 overflow-y-auto"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex flex-col h-full">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.path}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-4 w-full px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300`}
                        style={{
                          backgroundColor: activeLink === link.path ? `${secondaryColor}80` : 'transparent',
                          color: activeLink === link.path ? textOnDark : lightAccent
                        }}
                      >
                        <motion.span 
                          style={{ color: activeLink === link.path ? lightAccent : lightAccent }}
                          animate={{
                            rotate: activeLink === link.path ? [0, 10, -10, 0] : 0
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity
                          }}
                        >
                          {link.icon}
                        </motion.span>
                        <span>{link.name}</span>
                        {activeLink === link.path && (
                          <motion.span 
                            className="ml-auto h-2 w-2 rounded-full"
                            style={{ backgroundColor: lightAccent }}
                            animate={{ 
                              scale: [1, 1.5, 1],
                              boxShadow: [`0 0 0 0 ${lightAccent}70`, `0 0 0 10px ${lightAccent}00`]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div 
                  className="mt-auto pt-8"
                  style={{ borderTop: `1px solid ${accentColor}30` }}
                >
                  {isAuthenticated ? (
                    <motion.div
                      variants={containerVariants}
                      className="space-y-3"
                    >
                      <motion.div 
                        variants={itemVariants}
                        className="flex items-center space-x-4 px-6 py-4 rounded-xl"
                        style={{ backgroundColor: `${secondaryColor}80` }}
                      >
                        <div 
                          className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold shadow-md relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${lightAccent}, ${accentColor})` }}
                        >
                          <span className="relative z-10">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                          <div 
                            className="absolute inset-0 animate-pulse"
                            style={{ background: `linear-gradient(135deg, ${lightAccent}30, ${accentColor}30)` }}
                          ></div>
                        </div>
                        <div>
                          <p 
                            className="text-lg font-medium"
                            style={{ color: textOnDark }}
                          >
                            {user?.name || 'Usuario'}
                          </p>
                          <p 
                            className="text-sm"
                            style={{ color: lightAccent }}
                          >
                            {user?.email || 'usuario@ejemplo.com'}
                          </p>
                        </div>
                      </motion.div>
                      {profileLinks.map((item, index) => (
                        <motion.div
                          key={item.path || item.name}
                          variants={itemVariants}
                          custom={index}
                        >
                          {item.path ? (
                            <motion.div
                              whileHover={{ x: 5 }}
                              whileTap={{ x: 0 }}
                            >
                              <Link
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between w-full px-6 py-3 rounded-lg transition-all duration-300"
                                style={{ color: textOnDark }}
                              >
                                <div className="flex items-center">
                                  <span style={{ color: lightAccent }}>
                                    {item.icon}
                                  </span>
                                  <span className="ml-4">{item.name}</span>
                                </div>
                                {item.badge && (
                                  <span 
                                    className="text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: '#ef4444' }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            </motion.div>
                          ) : (
                            <motion.button
                              onClick={item.action}
                              className="flex items-center w-full px-6 py-3 rounded-lg transition-all duration-300"
                              style={{ color: textOnDark }}
                              whileHover={{ x: 5 }}
                              whileTap={{ x: 0 }}
                            >
                              <span style={{ color: '#ef4444' }}>{item.icon}</span>
                              <span className="ml-4">{item.name}</span>
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center space-x-3 w-full px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                          color: textOnDark
                        }}
                      >
                        <LogIn className="h-5 w-5" />
                        <span>Acceso Admin</span>
                      </Link>
                    </motion.div>
                  )}
                </div>

                <motion.div 
                  variants={itemVariants}
                  className="mt-8 text-center text-sm"
                  style={{ color: `${lightAccent}80` }}
                >
                  © {new Date().getFullYear()} New Talent Human. Todos los derechos reservados.
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Spacer to prevent content from being hidden under the fixed navbar */}
      <div className={`h-24 transition-all duration-300 ${scrolled ? 'opacity-90' : 'opacity-100'}`}></div>
    </>
  );
};

export default Navbar;