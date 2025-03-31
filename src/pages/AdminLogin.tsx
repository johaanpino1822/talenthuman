import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff, Loader2, ArrowRight, Key, User } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useTheme } from '../context/ThemeContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [particlesInit, setParticlesInit] = useState(false);
  const controls = useAnimation();
  const formRef = useRef(null);

  // Efecto de partículas
  const particlesLoaded = async (main) => {
    await loadFull(main);
    setParticlesInit(true);
  };

  // Efecto para limpiar el error después de 5 segundos
  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => {
        setLoginError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  // Animación inicial
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Usuario requerido')
        .min(3, 'Mínimo 3 caracteres'),
      password: Yup.string()
        .required('Contraseña requerida')
        .min(8, 'Mínimo 8 caracteres')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
          'Debe contener mayúsculas, minúsculas, números y caracteres especiales'
        ),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setLoginError('');
      
      // Animación de envío
      await controls.start({
        y: [0, -10, 0],
        transition: { duration: 0.3 }
      });

      try {
        const success = await login(values.username, values.password);
        if (success) {
          // Animación de éxito
          await controls.start({
            scale: [1, 0.95, 1],
            transition: { duration: 0.5 }
          });
          navigate('/admin/dashboard');
        } else {
          setLoginError('Credenciales inválidas');
          // Animación de error
          await controls.start({
            x: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.5 }
          });
        }
      } catch (error) {
        setLoginError('Error en el servidor. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const particlesOptions = {
    fullScreen: {
      enable: true,
      zIndex: -1
    },
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: theme === 'dark' ? '#a5b4fc' : '#6366f1'
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.3,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: theme === 'dark' ? '#a5b4fc' : '#6366f1',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'} transition-colors duration-500 p-4 relative overflow-hidden`}>
      {/* Fondo de partículas */}
      <Particles
        id="tsparticles"
        init={particlesLoaded}
        loaded={particlesInit}
        options={particlesOptions}
        className="absolute inset-0"
      />

      {/* Botón de cambio de tema */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg z-50"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <motion.div 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        ref={formRef}
      >
        <motion.div 
          className={`rounded-2xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-90'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} transition-all duration-500`}
          variants={cardVariants}
          whileHover={{ y: -5 }}
          animate={controls}
        >
          <div className="text-center mb-8">
            <motion.div 
              className={`mx-auto h-20 w-20 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-full flex items-center justify-center mb-4 relative overflow-hidden`}
              variants={itemVariants}
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lock className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-indigo-400 opacity-0"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.5, 2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop'
                }}
              />
            </motion.div>
            <motion.h2 
              className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}
              variants={itemVariants}
            >
              Acceso Administrativo
            </motion.h2>
            <motion.p 
              className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
              variants={itemVariants}
            >
              Ingrese sus credenciales para continuar
            </motion.p>
          </div>

          <AnimatePresence>
            {loginError && (
              <motion.div 
                className={`mb-6 p-3 rounded-lg flex items-center ${theme === 'dark' ? 'bg-red-900 bg-opacity-30 text-red-300' : 'bg-red-50 text-red-600'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {loginError}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <motion.div variants={itemVariants}>
              <label htmlFor="username" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${formik.touched.username && formik.errors.username ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  {...formik.getFieldProps('username')}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'} ${formik.touched.username && formik.errors.username ? 'border-red-500 focus:ring-red-500' : theme === 'dark' ? 'border-gray-600 focus:ring-indigo-500 focus:border-indigo-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Ingrese su usuario"
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {formik.touched.username && formik.errors.username && (
                <motion.p 
                  className="mt-1 text-sm text-red-500"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formik.errors.username}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className={`h-5 w-5 ${formik.touched.password && formik.errors.password ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  {...formik.getFieldProps('password')}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'} ${formik.touched.password && formik.errors.password ? 'border-red-500 focus:ring-red-500' : theme === 'dark' ? 'border-gray-600 focus:ring-indigo-500 focus:border-indigo-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="Ingrese su contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`} />
                  ) : (
                    <Eye className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`} />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <motion.p 
                  className="mt-1 text-sm text-red-500"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formik.errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-indigo-400' : 'focus:ring-indigo-500'} transition-all duration-200 ${isLoading ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span 
                          className="ml-2"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 10, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-6 text-center text-sm"
            variants={itemVariants}
          >
            <a 
              href="#forgot-password" 
              className={`font-medium ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} transition-colors duration-200 flex items-center justify-center`}
            >
              ¿Olvidó su contraseña?
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          className={`mt-8 text-center text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          variants={itemVariants}
        >
          © {new Date().getFullYear()} Sistema Administrativo. Todos los derechos reservados.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;