import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Mostrar u ocultar el botón "Volver arriba" basado en el scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const contactItems = [
    { icon: <Mail className="h-5 w-5" />, text: "contacto@talentpro.com", link: "mailto:contacto@talentpro.com" },
    { icon: <Phone className="h-5 w-5" />, text: "+1 234 567 890", link: "tel:+1234567890" },
    { icon: <MapPin className="h-5 w-5" />, text: "Torre Empresarial, Piso 22", link: "https://maps.google.com" }
  ];

  const socialLinks = [
    { icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn", url: "#", color: "hover:text-[#0077B5]" },
    { icon: <Twitter className="h-5 w-5" />, name: "Twitter", url: "#", color: "hover:text-[#1DA1F2]" },
    { icon: <Facebook className="h-5 w-5" />, name: "Facebook", url: "#", color: "hover:text-[#4267B2]" },
    { icon: <Instagram className="h-5 w-5" />, name: "Instagram", url: "#", color: "hover:text-[#E1306C]" }
  ];

  const footerLinks = [
    { title: "Empresa", links: ["Sobre Nosotros", "Equipo", "Carreras", "Noticias"] },
    { title: "Servicios", links: ["Reclutamiento", "Evaluación", "Desarrollo", "Consultoría"] },
    { title: "Legal", links: ["Política de Privacidad", "Términos", "Cookies", "Aviso Legal"] }
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

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Efecto de partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 py-16">
          {/* Logo y descripción */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="col-span-2"
          >
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg">
                TP
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                NewtalentHuman
              </h3>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Transformando el capital humano en el motor estratégico del éxito empresarial sostenible.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  className={`p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300 ${social.color} relative`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  {social.icon}
                  <AnimatePresence>
                    {hoveredSocial === index && (
                      <motion.span 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                      >
                        {social.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Enlaces del footer */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6 text-gray-100 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a 
                      href="#"
                      className="flex items-center text-gray-400 hover:text-cyan-300 transition-colors duration-300 group"
                      onMouseEnter={() => setHoveredLink(`${index}-${linkIndex}`)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <span className="mr-2 group-hover:text-cyan-300 transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                      {link}
                      {hoveredLink === `${index}-${linkIndex}` && (
                        <motion.span 
                          className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                          layoutId="footerLinkUnderline"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Información de contacto */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-gray-100 uppercase tracking-wider">
              Contacto
            </h3>
            <div className="space-y-4">
              {contactItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  className="flex items-start space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <span className="mt-0.5 text-cyan-300 group-hover:text-cyan-200 transition-colors">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-8"></div>

        {/* Copyright y enlaces legales */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 mb-4 md:mb-0 text-center md:text-left"
          >
            &copy; {new Date().getFullYear()} NewTalentHuman. Todos los derechos reservados.
          </motion.p>
          
          <div className="flex space-x-6">
            {["Política de Privacidad", "Términos de Servicio", "Cookies"].map((item, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-gray-400 hover:text-cyan-300 text-sm transition-colors duration-300"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Botón "Volver arriba" */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:from-cyan-400 hover:to-blue-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUpRight className="h-6 w-6 rotate-45" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Efecto de onda decorativo en la parte inferior */}
      <div className="relative h-20 w-full overflow-hidden">
        <div className="absolute -bottom-20 left-0 right-0 h-40 bg-gradient-to-t from-cyan-500/10 to-transparent rounded-full filter blur-xl"></div>
      </div>
    </footer>
  );
};

export default Footer;