import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, FileText, BarChart2, Briefcase, Clock, CheckCircle, 
  XCircle, Search, Filter, ChevronDown, ChevronUp, Download,
  Mail, MessageSquare, UserCheck, Calendar, Star, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const applications = [
    {
      id: 1,
      name: "Juan Pérez",
      position: "Gerente Profesional en Gestión del Talento Humano",
      date: "2024-03-15",
      status: "Pendiente",
      email: "juan.perez@example.com",
      phone: "+57 310 123 4567",
      experience: "8 años",
      rating: 4.5
    },
    {
      id: 2,
      name: "María García",
      position: "Gerente de Marketing Digital",
      date: "2024-03-14",
      status: "Revisado",
      email: "maria.garcia@example.com",
      phone: "+57 320 234 5678",
      experience: "10 años",
      rating: 4.8
    },
    {
      id: 3,
      name: "Carlos López",
      position: "Analista de Datos Senior",
      date: "2024-03-13",
      status: "Entrevista",
   
      email: "carlos.lopez@example.com",
      phone: "+57 315 345 6789",
      experience: "6 años",
     
      rating: 4.2
    },
    {
      id: 4,
      name: "Ana Rodríguez",
      position: "Diseñadora UX/UI",
      date: "2024-03-12",
      status: "Contratado",
      email: "ana.rodriguez@example.com",
      phone: "+57 300 456 7890",
      experience: "5 años",
      rating: 4.7
    },
    {
      id: 5,
      name: "Luis Martínez",
      position: "Especialista en RH",
      date: "2024-03-11",
      status: "Rechazado",
      email: "luis.martinez@example.com",
      phone: "+57 301 567 8901",
      experience: "7 años",
      rating: 3.9
    }
  ];

  const stats = [
    { 
      title: "Total Aplicaciones", 
      value: "156", 
      icon: <Users className="h-6 w-6" />,
      change: "+12%",
      trend: "up"
    },
    { 
      title: "Vacantes Activas", 
      value: "12", 
      icon: <Briefcase className="h-6 w-6" />,
      change: "+2",
      trend: "up"
    },
    { 
      title: "Tasa de Conversión", 
      value: "24%", 
      icon: <BarChart2 className="h-6 w-6" />,
      change: "+3%",
      trend: "up"
    },
    { 
      title: "Tiempo Promedio", 
      value: "15 días", 
      icon: <Clock className="h-6 w-6" />,
      change: "-2 días",
      trend: "down"
    }
  ];

  const statusOptions = ['Todos', 'Pendiente', 'Revisado', 'Entrevista', 'Contratado', 'Rechazado'];
  const dateOptions = ['Todos', 'Últimos 7 días', 'Últimos 30 días', 'Este mes', 'Mes pasado'];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || app.status === statusFilter;
    const matchesDate = dateFilter === 'Todos' || 
                       (dateFilter === 'Últimos 7 días' && isWithinDays(app.date, 7)) ||
                       (dateFilter === 'Últimos 30 días' && isWithinDays(app.date, 30)) ||
                       (dateFilter === 'Este mes' && isThisMonth(app.date)) ||
                       (dateFilter === 'Mes pasado' && isLastMonth(app.date));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  function isWithinDays(dateString, days) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= days;
  }

  function isThisMonth(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  function isLastMonth(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return date.getMonth() === lastMonth && date.getFullYear() === year;
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Revisado': return 'bg-blue-100 text-blue-800';
      case 'Entrevista': return 'bg-purple-100 text-purple-800';
      case 'Contratado': return 'bg-green-100 text-green-800';
      case 'Rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        className={`bg-indigo-700 text-white ${showSidebar ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}
        initial={{ width: 256 }}
        animate={{ width: showSidebar ? 256 : 80 }}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-600">
          {showSidebar ? (
            <h1 className="text-xl font-bold">New Talent</h1>
          ) : (
            <div className="w-8 h-8 bg-indigo-800 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">NT</span>
            </div>
          )}
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-white hover:text-indigo-200"
          >
            {showSidebar ? <ChevronDown className="transform rotate-90" /> : <ChevronUp className="transform rotate-90" />}
          </button>
        </div>
        
        <div className="p-4 flex items-center space-x-3 border-b border-indigo-600">
          
          {showSidebar && (
            <div>
              <p className="font-medium">{user?.name || "Admin"}</p>
              <p className="text-xs text-indigo-200">{user?.email || "admin@example.com"}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2">
          <ul>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg bg-indigo-800 text-white">
                <BarChart2 className="w-5 h-5" />
                {showSidebar && <span className="ml-3">Dashboard</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-indigo-800 text-white mt-1">
                <Users className="w-5 h-5" />
                {showSidebar && <span className="ml-3">Candidatos</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-indigo-800 text-white mt-1">
                <Briefcase className="w-5 h-5" />
                {showSidebar && <span className="ml-3">Vacantes</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-indigo-800 text-white mt-1">
                <Calendar className="w-5 h-5" />
                {showSidebar && <span className="ml-3">Calendario</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-indigo-800 text-white mt-1">
                <MessageSquare className="w-5 h-5" />
                {showSidebar && <span className="ml-3">Mensajes</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-indigo-800 text-white mt-1">
                <Settings className="w-5 h-5" />
                {showSidebar && <span className="ml-3">Configuración</span>}
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-indigo-600">
          <button 
            onClick={handleLogout}
            className="flex items-center text-white hover:text-indigo-200 w-full"
          >
            <XCircle className="w-5 h-5" />
            {showSidebar && <span className="ml-3">Cerrar Sesión</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className={`text-sm mt-3 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{stat.change}</span> {stat.trend === 'up' ? '↑' : '↓'} desde el mes pasado
                </p>
              </motion.div>
            ))}
          </div>

          {/* Applications Section */}
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">
                Aplicaciones Recientes
              </h3>
              
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar candidatos..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filtros</span>
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-4 border-b border-gray-200 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                      <select
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      >
                        {dateOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posición
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <motion.tr 
                      key={application.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`hover:bg-gray-50 ${selectedApplication?.id === application.id ? 'bg-indigo-50' : ''}`}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={application.avatar} alt={application.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{application.name}</div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.position}</div>
                        <div className="text-sm text-gray-500">{application.experience}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{application.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Mail className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <UserCheck className="h-4 w-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Application Details Panel */}
            <AnimatePresence>
              {selectedApplication && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{selectedApplication.name}</h4>
                      <p className="text-sm text-gray-500">{selectedApplication.position}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedApplication(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <div className="flex items-center justify-center">
                        <img 
                          src={selectedApplication.avatar} 
                          alt={selectedApplication.name} 
                          className="h-24 w-24 rounded-full"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <div className="flex items-center justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-5 w-5 ${i < Math.floor(selectedApplication.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{selectedApplication.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Información de Contacto</h5>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.email}</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.phone}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Experiencia</h5>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.experience}</p>
                        </div>
                        <div className="md:col-span-2">
                          <h5 className="text-sm font-medium text-gray-500">Habilidades</h5>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedApplication.skills.map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Download className="h-4 w-4 inline mr-2" />
                      Descargar CV
                    </button>
                    <button className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Enviar Mensaje
                    </button>
                    <button className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      Aprobar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;