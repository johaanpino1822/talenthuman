import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, ChevronRight, Star, Bookmark, Share2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const jobListings = [
  {
    id: 1,
    title: "Gerente Profesional en Gestión del Talento Humano",
    company: "Recursos Humanos S.A.",
    location: "Bogotá, Colombia",
    salary: "$4,500 - $6,500",
    requirements: [
      "5+ años de experiencia", 
      "Políticas de gestión del talento",
      "Reclutamiento y selección",
      "Programas de formación",
      "Evaluación de desempeño",
      "Normativas laborales"
    ],
    type: "Tiempo Completo",
    posted: "Hace 1 día",
    featured: true,
    logo: "https://via.placeholder.com/80/2563eb/ffffff?text=RH",
    description: "Dirigir estrategias de talento humano para atraer, retener y desarrollar colaboradores, alineados con los objetivos de la empresa."
  },
  {
    id: 2,
    title: "Especialista en Desarrollo Organizacional",
    company: "Growth Consulting",
    location: "Remoto",
    salary: "$3,800 - $5,200",
    requirements: [
      "4+ años de experiencia",
      "Desarrollo organizacional",
      "Clima laboral",
      "Cultura corporativa",
      "Planes de incentivos",
      "Relaciones laborales"
    ],
    type: "Tiempo Completo",
    posted: "Hace 3 días",
    featured: false,
    logo: "https://via.placeholder.com/80/7c3aed/ffffff?text=GC"
  },
  {
    id: 3,
    title: "Coordinador de Reclutamiento y Selección",
    company: "Talent Finders",
    location: "Medellín, Colombia",
    salary: "$3,000 - $4,000",
    requirements: [
      "3+ años de experiencia",
      "Procesos de reclutamiento",
      "Entrevistas por competencias",
      "Assessment centers",
      "Onboarding",
      "Employer branding"
    ],
    type: "Tiempo Completo",
    posted: "Hace 5 días",
    featured: true,
    logo: "https://via.placeholder.com/80/059669/ffffff?text=TF"
  }
];

const JobCard = ({ job, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl overflow-hidden ${job.featured ? 'border-l-4 border-indigo-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${job.featured ? 'from-indigo-500/5 to-blue-600/5' : 'from-gray-100/50 to-gray-200/50'} rounded-2xl`}></div>
      
      {job.featured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
          <Star className="h-3 w-3 mr-1" />
          Destacado
        </div>
      )}
      
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
              <img src={job.logo} alt={job.company} className="h-full w-full object-contain p-2" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
                <p className="text-gray-700 font-medium">{job.company}</p>
                {job.description && (
                  <p className="text-gray-600 mt-2 text-sm">{job.description}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2 rounded-full ${isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'} transition-colors`}
                >
                  <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <div className="flex items-center bg-gray-100/80 rounded-full px-3 py-1.5">
                <MapPin className="h-4 w-4 text-gray-600 mr-1.5" />
                <span className="text-gray-700">{job.location}</span>
              </div>
              <div className="flex items-center bg-gray-100/80 rounded-full px-3 py-1.5">
                <DollarSign className="h-4 w-4 text-gray-600 mr-1.5" />
                <span className="text-gray-700">{job.salary}</span>
              </div>
              <div className="flex items-center bg-gray-100/80 rounded-full px-3 py-1.5">
                <Briefcase className="h-4 w-4 text-gray-600 mr-1.5" />
                <span className="text-gray-700">{job.type}</span>
              </div>
              <div className="flex items-center bg-gray-100/80 rounded-full px-3 py-1.5">
                <Clock className="h-4 w-4 text-gray-600 mr-1.5" />
                <span className="text-gray-700">{job.posted}</span>
              </div>
            </div>
            
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2 text-indigo-500" />
                Funciones y Requisitos:
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-6 pt-6 border-t border-gray-200 flex justify-end"
            >
              <Link
                to={`/apply/${job.id}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 group"
              >
                <span>Aplicar Ahora</span>
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const HRJobs = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'featured', label: 'Destacados' },
    { id: 'remote', label: 'Remoto' },
    { id: 'fulltime', label: 'Tiempo Completo' },
    { id: 'leadership', label: 'Liderazgo' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oportunidades en <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">Gestión Humana</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra las mejores posiciones para desarrollar tu carrera en Recursos Humanos
          </p>
        </motion.div>
        
        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Buscar por puesto, empresa o habilidades..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filtros Avanzados
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filter.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Listado de trabajos */}
        <div className="space-y-6">
          {jobListings.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>
        
        {/* Paginación */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <nav className="inline-flex rounded-md shadow-sm bg-white p-1">
            <button className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-indigo-600 font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Siguiente
            </button>
          </nav>
        </motion.div>
      </div>
    </div>
  );
};

export default HRJobs;