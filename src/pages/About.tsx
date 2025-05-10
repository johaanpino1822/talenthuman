import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Target, ArrowRight, ChevronDown, Globe, BarChart2, Heart, Award, Clock, Zap, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const About = () => {
  // State for interactive elements
  const [activeTab, setActiveTab] = useState('mision');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [teamIndex, setTeamIndex] = useState(0);
  
  // Refs for scroll effects
  const aboutRef = useRef(null);
  const isInView = useInView(aboutRef, { amount: 0.3 });
  const controls = useAnimation();

  // Team members data
  const teamMembers = [
    {
      name: "Daniela Zea",
      role: "CEO & Fundadora",
      bio: "Experta en estrategia de talento con 15+ años en RH transformacional.",
      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop"
    },
    {
      name: "Daniel Chen",
      role: "Director de Innovación",
      bio: "Pionero en tecnologías de reclutamiento basado en data science.",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop"
    },
    {
      name: "Sophie Laurent",
      role: "Directora de Clientes",
      bio: "Especialista en desarrollo organizacional y experiencia del empleado.",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop"
    }
  ];

  // Values data
  const values = [
    { 
      name: "Excelencia", 
      icon: <Award className="w-8 h-8" />, 
      color: "text-purple-600",
      description: "Buscamos la máxima calidad en cada servicio que ofrecemos" 
    },
    { 
      name: "Innovación", 
      icon: <Zap className="w-8 h-8" />, 
      color: "text-blue-600",
      description: "Creemos en la mejora continua y la transformación digital" 
    },
    { 
      name: "Pasión", 
      icon: <Heart className="w-8 h-8" />, 
      color: "text-red-600",
      description: "Amamos lo que hacemos y eso se refleja en nuestros resultados" 
    },
    { 
      name: "Integridad", 
      icon: <Globe className="w-8 h-8" />, 
      color: "text-green-600",
      description: "Actuamos con ética y transparencia en todas nuestras relaciones" 
    },
    { 
      name: "Colaboración", 
      icon: <Users className="w-8 h-8" />, 
      color: "text-yellow-600",
      description: "Trabajamos en equipo para lograr objetivos compartidos" 
    },
    { 
      name: "Agilidad", 
      icon: <Clock className="w-8 h-8" />, 
      color: "text-indigo-600",
      description: "Respondemos rápidamente a las necesidades del mercado" 
    }
  ];

  // Scroll progress effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / scrollTotal) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate when in view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Auto-rotate team members
  useEffect(() => {
    const interval = setInterval(() => {
      setTeamIndex((prev) => (prev + 1) % teamMembers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [teamMembers.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const tabs = {
    mision: {
      title: "Nuestra Misión",
      content: "Impulsamos el desarrollo humano y organizacional a través de soluciones integrales en talento humano, con tecnología, innovación e inclusión, promoviendo ambientes diversos, éticos y sostenibles",
      icon: <Target className="w-6 h-6" />
    },
    vision: {
      title: "Nuestra Visión",
      content: "Ser en 2030 una empresa líder en Colombia en gestión del talento humano, reconocida por su enfoque inclusivo, tecnológico y humano, trasformando el mundo laboral con impacto positivo ",
      icon: <Briefcase className="w-6 h-6" />
    },
    proposito: {
      title: "Nuestro Propósito",
      content: "Impulsar el desarrollo económico y social a través de la conexión estratégica entre profesionales y empresas, basada en valores humanos y tecnológicos.",
      icon: <Users className="w-6 h-6" />
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 z-50" style={{ width: `${scrollProgress}%` }} />

      {/* 3D Parallax Hero */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('src/image/About.avif')" }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
              
        <motion.div 
          className="relative z-20 text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div 
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 inline-flex items-center">
              <Sparkles className="w-5 h-5 text-yellow-300 mr-2" />
              <span className="text-white font-medium">Innovación en Talento</span>
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">New Talent</span>
            <span className="block text-4xl md:text-5xl font-light mt-2">Human</span>
          </h1>
          
          <motion.p 
            className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Donde el potencial humano encuentra su expresión máxima en el mundo profesional
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold flex items-center mx-auto hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
              Descubre Nuestra Metodología <ArrowRight className="ml-3" />
            </button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 text-white animate-bounce" />
        </motion.div>
      </div>

      {/* About Section */}
      <section ref={aboutRef} className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute -top-20 left-0 w-full h-20 bg-gradient-to-b from-transparent to-gray-50 z-0"></div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="relative z-10"
        >
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="inline-flex items-center mb-4">
              <div className="w-12 h-px bg-indigo-600 mr-4"></div>
              <span className="text-indigo-600 font-medium">QUIÉNES SOMOS</span>
              <div className="w-12 h-px bg-indigo-600 ml-4"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Reimaginando la <span className="text-indigo-600">conexión</span> entre talento y organizaciones
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <div className="relative">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Equipo New Talent"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                En <span className="font-semibold text-indigo-600">New Talent, Human</span>, combinamos tecnología avanzada con un profundo entendimiento del comportamiento humano para revolucionar la gestión del talento.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Nuestra metodología única integra inteligencia artificial con psicología organizacional, permitiéndonos identificar no solo las competencias técnicas sino también el potencial de crecimiento de cada profesional.
              </p>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Creemos firmemente que el éxito de las organizaciones se construye sobre la base de equipos diversos, motivados y altamente capacitados.
              </p>
              
              <motion.div 
                whileHover={{ x: 5 }}
                className="inline-flex items-center text-indigo-600 font-medium cursor-pointer"
              >
                <span className="mr-2">Conoce nuestra historia</span>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Tabs Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Nuestros Principios</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Los fundamentos que guían cada una de nuestras acciones y decisiones
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              {Object.keys(tabs).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-5 rounded-xl flex-1 flex flex-col items-center transition-all ${activeTab === tab ? 'bg-indigo-600 shadow-lg' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  <div className={`mb-3 p-3 rounded-full ${activeTab === tab ? 'bg-white text-indigo-600' : 'bg-gray-700 text-gray-300'}`}>
                    {tabs[tab].icon}
                  </div>
                  <h3 className="text-xl font-semibold">{tabs[tab].title}</h3>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/50 backdrop-blur-md rounded-xl p-12 text-center max-w-4xl mx-auto border border-gray-700"
              >
                <p className="text-2xl leading-relaxed">{tabs[activeTab].content}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Values Carousel */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Nuestra Cultura</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Los pilares que definen nuestra forma de trabajar y relacionarnos
            </p>
          </motion.div>

          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            className="mySwiper h-96"
          >
            {values.map((value, index) => (
              <SwiperSlide key={index} className="bg-white rounded-xl shadow-xl overflow-hidden w-80">
                <motion.div 
                  className="h-full flex flex-col items-center justify-center p-8"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className={`mb-6 p-5 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-md ${value.color}`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.name}</h3>
                  <p className="text-gray-600 text-center">
                    {value.description}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Liderazgo Ejecutivo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              El equipo visionario detrás de nuestra estrategia transformacional
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${teamIndex === index ? 'z-10' : 'z-0'}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${hoveredCard === index ? 'transform -translate-y-4 shadow-xl' : ''}`}>
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={member.img} 
                      alt={member.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${hoveredCard === index ? 'scale-110' : 'scale-100'}`}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${hoveredCard === index ? 'opacity-100' : 'opacity-80'}`}></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                      <p className="text-indigo-200 font-medium">{member.role}</p>
                    </div>
                  </div>
                  <div className={`p-6 transition-all duration-300 ${hoveredCard === index ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
                    <p>{member.bio}</p>
                    <button className={`mt-4 px-4 py-2 rounded-lg font-medium flex items-center ${hoveredCard === index ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
                      Ver perfil <ArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={itemVariants} className="p-6">
              <div className="text-5xl font-bold mb-3">200+</div>
              <div className="text-xl font-medium">Empresas Transformadas</div>
            </motion.div>
            <motion.div variants={itemVariants} className="p-6">
              <div className="text-5xl font-bold mb-3">10K+</div>
              <div className="text-xl font-medium">Profesionales Colocados</div>
            </motion.div>
            <motion.div variants={itemVariants} className="p-6">
              <div className="text-5xl font-bold mb-3">95%</div>
              <div className="text-xl font-medium">Tasa de Retención</div>
            </motion.div>
            <motion.div variants={itemVariants} className="p-6">
              <div className="text-5xl font-bold mb-3">15</div>
              <div className="text-xl font-medium">Países de Operación</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive CTA */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-12 text-center relative">
            <motion.div 
              className="absolute top-0 left-0 w-full h-full opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear'
              }}
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 20%)',
              }}
            />
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              ¿Listo para revolucionar tu estrategia de talento?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Agenda una consultoría gratuita con nuestros especialistas y descubre lo que podemos lograr juntos.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative z-10"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold flex items-center mx-auto shadow-lg"
              >
                <span>Contactar a un Especialista</span>
                <ArrowRight className="ml-3 w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;