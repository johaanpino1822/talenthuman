import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, MapPin, DollarSign, Clock, ChevronRight, 
  Star, Bookmark, Share2, Users, Search, Filter, 
  X, Loader2, ChevronLeft, ChevronDown, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Types
type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  type: string;
  posted: string;
  featured: boolean;
  logo: string;
  description?: string;
  skills?: string[];
};

type FilterType = {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
};

type AdvancedFilterOptions = {
  jobTypes: string[];
  experienceLevels: string[];
  salaryRanges: string[];
};

// Constants

export const JOB_LISTINGS: Job[] = [
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
    description: "Dirigir estrategias de talento humano para atraer, retener y desarrollar colaboradores, alineados con los objetivos de la empresa.",
    skills: ["Liderazgo", "Gestión estratégica", "Comunicación"]
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
    logo: "https://via.placeholder.com/80/7c3aed/ffffff?text=GC",
    skills: ["Análisis", "Facilitación", "Innovación"]
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
    logo: "https://via.placeholder.com/80/059669/ffffff?text=TF",
    skills: ["Reclutamiento", "Selección", "Employer Branding"]
  }
];
const FILTERS: FilterType[] = [
  { id: 'all', label: 'Todos', icon: Briefcase },
  { id: 'featured', label: 'Destacados', icon: Star },
  { id: 'remote', label: 'Remoto', icon: MapPin },
  { id: 'fulltime', label: 'Tiempo Completo', icon: Clock },
  { id: 'leadership', label: 'Liderazgo', icon: Users }
];

const ADVANCED_FILTERS: AdvancedFilterOptions = {
  jobTypes: ["Tiempo Completo", "Medio Tiempo", "Contrato", "Freelance", "Prácticas"],
  experienceLevels: ["Junior", "Mid-Level", "Senior", "Directivo"],
  salaryRanges: ["$1,000-$2,000", "$2,000-$3,000", "$3,000-$5,000", "$5,000+"]
};

// Components
const AnimatedCheckmark = ({ checked }: { checked: boolean }) => (
  <motion.div
    initial={false}
    animate={{ scale: checked ? 1 : 0 }}
    className="h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center"
  >
    <Check className="h-3 w-3 text-white" />
  </motion.div>
);

const Chip = ({ 
  children, 
  onRemove 
}: { 
  children: React.ReactNode, 
  onRemove?: () => void 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
  >
    {children}
    {onRemove && (
      <button 
        onClick={onRemove}
        className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Remover filtro"
      >
        <X className="h-3 w-3" />
      </button>
    )}
  </motion.div>
);

const JobBadge = ({ children }: { children: React.ReactNode }) => (
  <motion.span 
    whileHover={{ scale: 1.05 }}
    className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full cursor-default"
  >
    {children}
  </motion.span>
);

const JobMetaItem = ({ icon: Icon, children }: { icon: React.ComponentType<any>, children: React.ReactNode }) => (
  <motion.div 
    whileHover={{ y: -1 }}
    className="flex items-center bg-gray-100/80 rounded-full px-3 py-1.5"
  >
    <Icon className="h-4 w-4 text-gray-600 mr-1.5" />
    <span className="text-gray-700">{children}</span>
  </motion.div>
);

const SkillPill = ({ skill }: { skill: string }) => (
  <motion.span
    whileHover={{ scale: 1.05 }}
    className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
  >
    {skill}
  </motion.span>
);

const JobCard = ({ job, index }: { job: Job, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
      className={`relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        job.featured ? 'border-l-4 border-indigo-500' : 'border border-gray-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${
        job.featured 
          ? 'from-indigo-500/5 to-blue-600/5' 
          : 'from-gray-50/50 to-gray-100/50'
      } rounded-2xl`} />
      
      {job.featured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
          <Star className="h-3 w-3 mr-1" fill="currentColor" />
          Destacado
        </div>
      )}
      
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0">
            <motion.div 
              whileHover={{ rotate: 2 }}
              className="h-16 w-16 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center shadow-sm"
            >
              <img 
                src={job.logo} 
                alt={job.company} 
                className="h-full w-full object-contain p-2" 
                loading="lazy"
              />
            </motion.div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
                <p className="text-gray-700 font-medium">{job.company}</p>
                {job.description && (
                  <motion.p 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: isExpanded ? 'auto' : '1.5em', 
                      opacity: 1 
                    }}
                    className="text-gray-600 mt-2 text-sm overflow-hidden"
                  >
                    {isExpanded ? job.description : `${job.description.substring(0, 100)}...`}
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="ml-1 text-indigo-600 hover:underline text-sm font-medium"
                    >
                      {isExpanded ? 'Mostrar menos' : 'Mostrar más'}
                    </button>
                  </motion.p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSaved(!isSaved);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    isSaved 
                      ? 'text-indigo-600 bg-indigo-50 shadow-inner' 
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  aria-label={isSaved ? 'Remover de guardados' : 'Guardar trabajo'}
                >
                  <Bookmark 
                    className="h-5 w-5" 
                    fill={isSaved ? 'currentColor' : 'none'} 
                  />
                </button>
                <button 
                  className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  aria-label="Compartir trabajo"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {job.skills && (
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <SkillPill key={i} skill={skill} />
                ))}
              </div>
            )}
            
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <JobMetaItem icon={MapPin}>{job.location}</JobMetaItem>
              <JobMetaItem icon={DollarSign}>{job.salary}</JobMetaItem>
              <JobMetaItem icon={Briefcase}>{job.type}</JobMetaItem>
              <JobMetaItem icon={Clock}>{job.posted}</JobMetaItem>
            </div>
            
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isExpanded ? 'auto' : 0, 
                opacity: isExpanded ? 1 : 0 
              }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-indigo-500" />
                  Funciones y Requisitos:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, i) => (
                    <JobBadge key={i}>{req}</JobBadge>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <AnimatePresence>
          {(isHovered || isExpanded) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-6 pt-6 border-t border-gray-200 flex justify-end"
            >
              <Link
                to={`/apply/${job.id}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 group shadow-sm"
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

const AdvancedFilterDropdown = ({
  isOpen,
  onClose,
  appliedFilters,
  setAppliedFilters
}: {
  isOpen: boolean;
  onClose: () => void;
  appliedFilters: Record<string, string[]>;
  setAppliedFilters: (filters: Record<string, string[]>) => void;
}) => {
  const [localFilters, setLocalFilters] = useState<Record<string, string[]>>(appliedFilters);

  const toggleFilter = (category: string, value: string) => {
    setLocalFilters(prev => {
      const currentFilters = prev[category] || [];
      return {
        ...prev,
        [category]: currentFilters.includes(value)
          ? currentFilters.filter(v => v !== value)
          : [...currentFilters, value]
      };
    });
  };

  const applyFilters = () => {
    setAppliedFilters(localFilters);
    onClose();
  };

  const resetFilters = () => {
    setLocalFilters({ jobTypes: [], experienceLevels: [], salaryRanges: [] });
  };

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(appliedFilters);
    }
  }, [isOpen, appliedFilters]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 top-full right-0 mt-2 w-full md:w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filtros Avanzados</h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Tipo de Empleo</h4>
                <div className="space-y-2">
                  {ADVANCED_FILTERS.jobTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleFilter('jobTypes', type)}
                      className="flex items-center w-full text-left p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-5 w-5 rounded border border-gray-300 mr-3 flex items-center justify-center">
                        <AnimatedCheckmark checked={localFilters.jobTypes?.includes(type) || false} />
                      </div>
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Nivel de Experiencia</h4>
                <div className="space-y-2">
                  {ADVANCED_FILTERS.experienceLevels.map(level => (
                    <button
                      key={level}
                      onClick={() => toggleFilter('experienceLevels', level)}
                      className="flex items-center w-full text-left p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-5 w-5 rounded border border-gray-300 mr-3 flex items-center justify-center">
                        <AnimatedCheckmark checked={localFilters.experienceLevels?.includes(level) || false} />
                      </div>
                      <span>{level}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Rango Salarial</h4>
                <div className="space-y-2">
                  {ADVANCED_FILTERS.salaryRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => toggleFilter('salaryRanges', range)}
                      className="flex items-center w-full text-left p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-5 w-5 rounded border border-gray-300 mr-3 flex items-center justify-center">
                        <AnimatedCheckmark checked={localFilters.salaryRanges?.includes(range) || false} />
                      </div>
                      <span>{range}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-between border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Limpiar todo
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  appliedFilters,
  setAppliedFilters
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (id: string) => void;
  appliedFilters: Record<string, string[]>;
  setAppliedFilters: (filters: Record<string, string[]>) => void;
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulate loading for demo purposes
  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const removeFilter = (category: string, value: string) => {
    setAppliedFilters({
      ...appliedFilters,
      [category]: appliedFilters[category].filter(v => v !== value)
    });
  };

  const hasAppliedFilters = Object.values(appliedFilters).some(filters => filters.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-6 mb-10 relative"
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
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 relative">
          <button 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
              hasAppliedFilters
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filtros Avanzados
            {hasAppliedFilters && (
              <span className="ml-2 bg-indigo-600 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {Object.values(appliedFilters).flat().length}
              </span>
            )}
          </button>
          
          <AdvancedFilterDropdown
            isOpen={isAdvancedOpen}
            onClose={() => setIsAdvancedOpen(false)}
            appliedFilters={appliedFilters}
            setAppliedFilters={setAppliedFilters}
          />
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
              activeFilter === filter.id 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.icon && <filter.icon className="h-4 w-4 mr-1.5" />}
            {filter.label}
          </button>
        ))}
      </div>
      
      {hasAppliedFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <div className="flex flex-wrap gap-2">
            {appliedFilters.jobTypes?.map(filter => (
              <Chip key={filter} onRemove={() => removeFilter('jobTypes', filter)}>
                {filter}
              </Chip>
            ))}
            {appliedFilters.experienceLevels?.map(filter => (
              <Chip key={filter} onRemove={() => removeFilter('experienceLevels', filter)}>
                {filter}
              </Chip>
            ))}
            {appliedFilters.salaryRanges?.map(filter => (
              <Chip key={filter} onRemove={() => removeFilter('salaryRanges', filter)}>
                {filter}
              </Chip>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-12 flex justify-center"
    >
      <nav className="inline-flex rounded-md shadow-sm bg-white p-1">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </button>
        <button 
          onClick={() => setCurrentPage(1)}
          className={`px-4 py-2 border-t border-b border-gray-300 ${
            currentPage === 1 ? 'bg-indigo-50 text-indigo-600 font-medium' : 'bg-white text-gray-700'
          }`}
        >
          1
        </button>
        <button 
          onClick={() => setCurrentPage(2)}
          className={`px-4 py-2 border border-gray-300 ${
            currentPage === 2 ? 'bg-indigo-50 text-indigo-600 font-medium' : 'bg-white text-gray-700'
          }`}
        >
          2
        </button>
        <button 
          onClick={() => setCurrentPage(3)}
          className={`px-4 py-2 border-t border-b border-gray-300 ${
            currentPage === 3 ? 'bg-indigo-50 text-indigo-600 font-medium' : 'bg-white text-gray-700'
          }`}
        >
          3
        </button>
        <button 
          onClick={() => setCurrentPage(4)}
          className={`px-4 py-2 border border-gray-300 ${
            currentPage === 4 ? 'bg-indigo-50 text-indigo-600 font-medium' : 'bg-white text-gray-700'
          }`}
        >
          4
        </button>
        <button 
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === 4}
          className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </nav>
    </motion.div>
  );
};

const HRJobs = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({
    jobTypes: [],
    experienceLevels: [],
    salaryRanges: []
  });

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
        
        <SearchAndFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
        />
        
        <div className="space-y-6">
          {JOB_LISTINGS.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>
        
        <Pagination />
      </div>
    </div>
  );
};


export default HRJobs;
