import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [hoveredService, setHoveredService] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  const services = [
    {
      icon: <Users className="h-12 w-12" />,
      title: "Reclutamiento",
      description: "Selección precisa de talento para tu empresa",
      color: "from-indigo-400 to-blue-500"
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: "Desarrollo",
      description: "Programas de crecimiento profesional",
      color: "from-cyan-400 to-teal-500"
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: "Evaluación",
      description: "Análisis de desempeño y competencias",
      color: "from-purple-400 to-fuchsia-500"
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: "Consultoría",
      description: "Asesoría estratégica en RRHH",
      color: "from-blue-400 to-indigo-500"
    }
  ];

  const stats = [
    { value: "500+", label: "Empresas Satisfechas" },
    { value: "10,000+", label: "Profesionales Colocados" },
    { value: "95%", label: "Tasa de Retención" }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-20 py-16 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              Transformamos el <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Talento</span> en Éxito
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto"
            >
              Soluciones innovadoras de gestión de talento humano para impulsar tu organización al siguiente nivel
            </motion.p>
            
            <motion.div variants={fadeIn}>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explorar Oportunidades
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Soluciones integrales diseñadas para optimizar la gestión de tu capital humano
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredService(index)}
              onMouseLeave={() => setHoveredService(null)}
              className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 from-blue-500 to-indigo-500"></div>
              
              <div className={`text-white mb-6 flex justify-center rounded-full p-4 bg-gradient-to-br ${service.color} shadow-md relative z-10`}>
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 relative z-10">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 relative z-10">
                {service.description}
              </p>
              
              <AnimatePresence>
                {hoveredService === index && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <Link 
                      to="/services" 
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                    >
                      Saber más <ChevronRight className="h-5 w-5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
                className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-0 hover:opacity-5 transition-opacity duration-300"></div>
                
                <motion.div 
                  animate={{ 
                    scale: hoveredStat === index ? 1.1 : 1,
                    rotate: hoveredStat === index ? 2 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6"
                >
                  {stat.value}
                </motion.div>
                
                <div className="text-xl text-gray-700">
                  {stat.label}
                </div>
                
                {hoveredStat === index && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-xl"
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            ¿Listo para transformar tu gestión de talento?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Descubre cómo podemos ayudarte a encontrar y retener el mejor talento para tu organización.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Contactar Ahora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Conócenos Más
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;