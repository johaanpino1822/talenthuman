import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, TrendingUp, ChevronRight, ArrowRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [hoveredService, setHoveredService] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);

  // Paleta de colores basada en #051e56
  const primaryColor = '#051e56';
  const secondaryColor = '#1a3a8f';
  const accentColor = '#4a7cff';
  const lightAccent = '#a8c2ff';
  const textOnDark = '#f8fafc';

  const services = [
    {
      icon: <Users className="h-12 w-12" />,
      title: "Reclutamiento",
      description: "Selección precisa de talento para tu empresa",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: "Desarrollo",
      description: "Programas de crecimiento profesional",
      color: "from-indigo-400 to-indigo-600"
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: "Evaluación",
      description: "Análisis de desempeño y competencias",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: "Consultoría",
      description: "Asesoría estratégica en RRHH",
      color: "from-blue-500 to-blue-700"
    }
  ];

  const stats = [
    { value: "500+", label: "Empresas Satisfechas" },
    { value: "10,000+", label: "Profesionales Colocados" },
    { value: "95%", label: "Tasa de Retención" }
  ];

  const pdfDocuments = [
    {
      id: '1',
      title: 'Manual de Reclutamiento',
      url: 'src/Documents/MANUALIEFAG2024Revisado.pdf',
      description: 'Guía completa de procesos de selección',
      size: '2.1 MB'
    },
    {
      id: '2',
      title: 'Políticas de RH',
      url: '/documents/politicas-rh.pdf',
      description: 'Documento oficial de políticas de recursos humanos',
      size: '1.5 MB'
    },
    {
      id: '3',
      title: 'Formulario de Aplicación',
      url: '/documents/formulario-aplicacion.pdf',
      description: 'Formulario estándar para candidatos',
      size: '0.8 MB'
    }
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

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title.endsWith('.pdf') ? title : `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-20 py-16 overflow-x-hidden">
      {/* Botón flotante para documentos */}
      <button 
        onClick={() => setShowDocuments(true)}
        className="fixed bottom-8 right-8 bg-[#051e56] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50 flex items-center gap-2"
        style={{ backgroundColor: primaryColor }}
      >
        <FileText className="h-6 w-6" />
        <span className="hidden sm:inline">Documentos</span>
      </button>

      {/* Modal de documentos */}
      <AnimatePresence>
        {showDocuments && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDocuments(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Documentos Disponibles</h3>
                  <button 
                    onClick={() => setShowDocuments(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {pdfDocuments.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800">{doc.title}</h4>
                          <p className="text-gray-600">{doc.description}</p>
                          <p className="text-sm text-gray-500 mt-1">{doc.size}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.open(doc.url, '_blank')}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            Ver
                          </button>
                          <button 
                            onClick={() => handleDownload(doc.url, doc.title)}
                            className="px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Descargar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section 
        className="relative text-white py-32 overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0" style={{ backgroundColor: primaryColor, opacity: 0.9 }}></div>
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
              style={{ color: textOnDark }}
            >
              Transformamos el <span style={{ color: lightAccent }}>Talento</span> en Éxito
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
              style={{ color: lightAccent }}
            >
              Soluciones innovadoras de gestión de talento humano para impulsar tu organización al siguiente nivel
            </motion.p>
            
            <motion.div variants={fadeIn}>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                style={{ backgroundColor: accentColor }}
              >
                <span className="relative z-10 flex items-center">
                  Explorar Oportunidades
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: secondaryColor }}
                ></span>
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
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
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
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: primaryColor }}
              ></div>
              
              <div 
                className={`text-white mb-6 flex justify-center rounded-full p-4 shadow-md relative z-10 ${service.color}`}
              >
                {service.icon}
              </div>
              
              <h3 
                className="text-2xl font-semibold mb-4 relative z-10"
                style={{ color: primaryColor }}
              >
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
                      className="inline-flex items-center font-medium transition-colors"
                      style={{ color: accentColor }}
                    >
                      Saber más <ChevronRight className="h-5 w-5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Tarjeta adicional para documentos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            onClick={() => setShowDocuments(true)}
            className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{ backgroundColor: primaryColor }}
            ></div>
            
            <div 
              className="text-white mb-6 flex justify-center rounded-full p-4 shadow-md relative z-10"
              style={{ backgroundColor: accentColor }}
            >
              <FileText className="h-12 w-12" />
            </div>
            
            <h3 
              className="text-2xl font-semibold mb-4 relative z-10"
              style={{ color: primaryColor }}
            >
              Documentos
            </h3>
            
            <p className="text-gray-600 mb-6 relative z-10">
              Accede a nuestros recursos y formularios en PDF
            </p>
            
            <div className="relative z-10">
              <div 
                className="inline-flex items-center font-medium group-hover:text-blue-800 transition-colors"
                style={{ color: accentColor }}
              >
                Ver documentos <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-24"
        style={{ backgroundColor: lightAccent }}
      >
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
                <div 
                  className="absolute inset-0 opacity-0 hover:opacity-5 transition-opacity duration-300"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                
                <motion.div 
                  animate={{ 
                    scale: hoveredStat === index ? 1.1 : 1,
                    rotate: hoveredStat === index ? 2 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-5xl font-bold mb-6"
                  style={{ color: primaryColor }}
                >
                  {stat.value}
                </motion.div>
                
                <div 
                  className="text-xl"
                  style={{ color: secondaryColor }}
                >
                  {stat.label}
                </div>
                
                {hoveredStat === index && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-0 left-0 h-1"
                    style={{ backgroundColor: accentColor }}
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
          className="rounded-3xl p-12 text-center shadow-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <h3 
            className="text-3xl font-bold mb-6"
            style={{ color: textOnDark }}
          >
            ¿Listo para transformar tu gestión de talento?
          </h3>
          <p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: lightAccent }}
          >
            Descubre cómo podemos ayudarte a encontrar y retener el mejor talento para tu organización.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              style={{ color: primaryColor }}
            >
              Contactar Ahora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              style={{ borderColor: textOnDark, color: textOnDark }}
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