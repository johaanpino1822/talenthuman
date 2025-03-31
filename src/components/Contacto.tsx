import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User, MessageSquare, ChevronRight, Check } from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const formRef = useRef();
  const controls = useAnimation();
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
      'service_bavse3p',
      'template_zokfxou',
      formRef.current,
      'sVZnksKOLryMD-x3z'
    )
    .then(() => {
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    })
    .catch(() => {
      alert('Error al enviar el mensaje. Por favor intente nuevamente.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

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

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 text-indigo-600" />,
      title: "Correo Electrónico",
      value: "contacto@newtalent.com",
      action: "Envíanos un mensaje"
    },
    {
      icon: <Phone className="w-6 h-6 text-indigo-600" />,
      title: "Teléfono",
      value: "+1 (555) 123-4567",
      action: "Llámanos ahora"
    },
    {
      icon: <MapPin className="w-6 h-6 text-indigo-600" />,
      title: "Oficina Principal",
      value: "Av. Innovación 1234, Tech District, CDMX",
      action: "Ver en mapa"
    }
  ];

  return (
    <section 
      id="contacto" 
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      ref={ref}
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="relative max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Contacta a Nuestro Equipo
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos listos para ayudarte a encontrar el talento que tu organización necesita para crecer.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          >
            <div className="p-8 sm:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Send className="w-6 h-6 text-indigo-600 mr-3" />
                Envíanos un Mensaje
              </h3>
              
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 text-green-700 p-6 rounded-lg flex items-start"
                >
                  <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">¡Mensaje Enviado!</h4>
                    <p>Gracias por contactarnos. Un miembro de nuestro equipo se comunicará contigo pronto.</p>
                  </div>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <label 
                      htmlFor="name" 
                      className={`absolute left-4 transition-all duration-200 ${
                        activeField === 'name' || formData.name 
                          ? 'top-1 text-xs text-indigo-600' 
                          : 'top-4 text-gray-500'
                      }`}
                    >
                      Nombre Completo
                    </label>
                    <div className="relative mt-6">
                      <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                        activeField === 'name' ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setActiveField('name')}
                        onBlur={() => setActiveField(null)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-b-2 border-gray-300 focus:border-indigo-600 focus:outline-none transition-colors duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label 
                      htmlFor="email" 
                      className={`absolute left-4 transition-all duration-200 ${
                        activeField === 'email' || formData.email 
                          ? 'top-1 text-xs text-indigo-600' 
                          : 'top-4 text-gray-500'
                      }`}
                    >
                      Correo Electrónico
                    </label>
                    <div className="relative mt-6">
                      <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                        activeField === 'email' ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setActiveField('email')}
                        onBlur={() => setActiveField(null)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-b-2 border-gray-300 focus:border-indigo-600 focus:outline-none transition-colors duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label 
                      htmlFor="message" 
                      className={`absolute left-4 transition-all duration-200 ${
                        activeField === 'message' || formData.message 
                          ? 'top-1 text-xs text-indigo-600' 
                          : 'top-4 text-gray-500'
                      }`}
                    >
                      Tu Mensaje
                    </label>
                    <div className="relative mt-6">
                      <MessageSquare className={`absolute left-4 top-4 ${
                        activeField === 'message' ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setActiveField('message')}
                        onBlur={() => setActiveField(null)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-b-2 border-gray-300 focus:border-indigo-600 focus:outline-none transition-colors duration-200 resize-none"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-lg font-bold flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensaje <ChevronRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Methods */}
          <motion.div variants={itemVariants} className="space-y-6">
            {contactMethods.map((method, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="p-8 flex items-start">
                  <div className="bg-indigo-50 p-4 rounded-full mr-6">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{method.title}</h3>
                    <p className="text-gray-600 mb-3">{method.value}</p>
                    <a 
                      href="#" 
                      className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                    >
                      {method.action} <ChevronRight className="ml-1 w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Map Embed */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="h-64 w-full bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-indigo-600 animate-bounce" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Visita Nuestras Oficinas</h3>
                <p className="text-gray-600 mb-4">Agenda una reunión presencial con nuestro equipo de especialistas.</p>
                <button className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-gray-800 transition-colors">
                  Ver Dirección Completa <ChevronRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Team Availability */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8 md:p-10 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Horario de Atención</h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Nuestro equipo está disponible de lunes a viernes de 9:00 am a 6:00 pm. 
              Responderemos a tu consulta en un máximo de 24 horas hábiles.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((day, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg">
                  <span className="font-medium">{day}</span> 9:00 - 18:00
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactSection;