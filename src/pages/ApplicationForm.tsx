import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Phone, Briefcase, BookOpen, Users, FileText, Check, X, ChevronRight, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type JobRequirements = {
  title: string;
  experience: number;
  skills: string[];
  education: string;
  logo?: string;
  minSalary: number;
  maxSalary: number;
  description: string;
  responsibilities: string[];
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  skills: string;
  resume: File | null;
  coverLetter: string;
  salaryExpectation: string;
  availability: string;
  references: string;
  languages: string;
};

const DEFAULT_JOB: JobRequirements = {
  title: "Gerente Profesional en Gestión del Talento Humano",
  experience: 5,
  skills: [
    "Políticas de gestión del talento",
    "Reclutamiento y selección",
    "Desarrollo organizacional",
    "Evaluación de desempeño",
    "Clima laboral",
    "Cultura corporativa",
    "Normativas laborales",
    "Resolución de conflictos"
  ],
  education: "Psicología Organizacional, Administración de Empresas o afín",
  minSalary: 4500,
  maxSalary: 6500,
  description: "Dirigir estrategias de talento humano para atraer, retener y desarrollar colaboradores, alineados con los objetivos de la empresa.",
  responsibilities: [
    "Diseñar e implementar políticas de gestión del talento",
    "Coordinar reclutamiento, selección y retención de talento",
    "Desarrollar programas de formación y liderazgo",
    "Evaluar desempeño y proponer planes de incentivos",
    "Mejorar el clima organizacional y la cultura corporativa",
    "Garantizar el cumplimiento de normativas laborales",
    "Gestionar relaciones laborales y resolución de conflictos"
  ]
};

const HRManagerApplicationForm = () => {
  const { jobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'rejected'>('idle');
  const [progress, setProgress] = useState(0);
  const [fileError, setFileError] = useState('');
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Usar el trabajo por defecto si no hay jobId
  const requirements = DEFAULT_JOB;

  useEffect(() => {
    // Redirigir si no hay jobId (en caso de que quieras manejar múltiples trabajos)
    if (!jobId) {
      navigate('/hr-jobs', { replace: true });
    }
  }, [jobId, navigate]);

  const calculateCompatibility = useCallback((values: FormValues) => {
    let compatibility = 0;
    const totalPoints = 4; // Experiencia, educación, habilidades, salario

    // Verificar experiencia (25%)
    if (values.experience) {
      compatibility += parseInt(values.experience) >= requirements.experience ? 25 : 0;
    }

    // Verificar educación (25%)
    if (values.education) {
      const educationMatch = requirements.education.split(',').some(edu => 
        values.education.toLowerCase().includes(edu.toLowerCase().trim())
      );
      compatibility += educationMatch ? 25 : 0;
    }

    // Verificar habilidades (25%)
    if (values.skills) {
      const matchedSkills = requirements.skills.filter(skill => 
        values.skills.toLowerCase().includes(skill.toLowerCase())
      ).length;
      compatibility += (matchedSkills / requirements.skills.length) * 25;
    }

    // Verificar salario (25%)
    if (values.salaryExpectation) {
      const salary = parseInt(values.salaryExpectation);
      compatibility += (salary >= requirements.minSalary && salary <= requirements.maxSalary) ? 25 : 0;
    }

    return Math.min(Math.round(compatibility), 100);
  }, [requirements]);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      experience: '',
      education: '',
      skills: '',
      resume: null,
      coverLetter: '',
      salaryExpectation: '',
      availability: 'inmediata',
      references: '',
      languages: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Nombre completo es requerido')
        .min(3, 'Mínimo 3 caracteres')
        .max(50, 'Máximo 50 caracteres'),
      email: Yup.string()
        .email('Ingrese un email válido')
        .required('Email es requerido'),
      phone: Yup.string()
        .required('Teléfono es requerido')
        .matches(/^[0-9]+$/, 'Solo números permitidos')
        .min(10, 'Mínimo 10 dígitos')
        .max(15, 'Máximo 15 dígitos'),
      experience: Yup.number()
        .required('Años de experiencia son requeridos')
        .min(0, 'La experiencia no puede ser negativa')
        .max(50, 'Máximo 50 años'),
      education: Yup.string()
        .required('Formación académica es requerida')
        .min(5, 'Mínimo 5 caracteres'),
      skills: Yup.string()
        .required('Habilidades son requeridas')
        .min(20, 'Describa al menos 3 habilidades relevantes'),
      coverLetter: Yup.string()
        .required('Carta de presentación es requerida')
        .min(200, 'Mínimo 200 caracteres')
        .max(2000, 'Máximo 2000 caracteres'),
      salaryExpectation: Yup.number()
        .required('Expectativa salarial es requerida')
        .min(1000, 'Mínimo $1,000')
        .max(20000, 'Máximo $20,000'),
      references: Yup.string()
        .required('Proporcione al menos 2 referencias')
        .min(20, 'Mínimo 20 caracteres'),
      languages: Yup.string()
        .required('Idiomas dominados son requeridos')
        .min(2, 'Mínimo 2 caracteres'),
      resume: Yup.mixed()
        .required('CV es requerido')
        .test(
          'fileSize',
          'El archivo es muy grande (máx. 5MB)',
          value => value && value.size <= 5 * 1024 * 1024
        )
        .test(
          'fileType',
          'Solo se aceptan PDF',
          value => value && value.type === 'application/pdf'
        )
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 150);

      try {
        // Validación avanzada de requisitos
        const meetsExp = parseInt(values.experience) >= requirements.experience;
        const meetsEducation = requirements.education.split(',').some(edu => 
          values.education.toLowerCase().includes(edu.toLowerCase().trim())
        );
        const meetsSkills = requirements.skills.filter(skill => 
          values.skills.toLowerCase().includes(skill.toLowerCase())
        ).length >= Math.ceil(requirements.skills.length * 0.6);
        const meetsSalary = parseInt(values.salaryExpectation) >= requirements.minSalary && 
                          parseInt(values.salaryExpectation) <= requirements.maxSalary;

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        clearInterval(interval);
        setProgress(100);
        
        if (meetsExp && meetsEducation && meetsSkills && meetsSalary) {
          setSubmitStatus('success');
        } else {
          setSubmitStatus('rejected');
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        setSubmitStatus('rejected');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError('El archivo es muy grande (máx. 5MB)');
        formik.setFieldError('resume', 'El archivo es muy grande (máx. 5MB)');
        return;
      }
      
      if (file.type !== 'application/pdf') {
        setFileError('Solo se aceptan archivos PDF');
        formik.setFieldError('resume', 'Solo se aceptan archivos PDF');
        return;
      }
      
      setFileError('');
      formik.setFieldValue('resume', file);
      formik.setFieldError('resume', undefined);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatPhone = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const RequirementCheck = ({ met, children }: { met: boolean, children: React.ReactNode }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      )}
      <span>{children}</span>
    </div>
  );

  const displayedSkills = showAllSkills 
    ? requirements.skills 
    : requirements.skills.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Aplicar a: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">
              {requirements.title}
            </span>
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
            {requirements.description}
          </p>
          <p className="mt-2 text-gray-500">Complete todos los campos requeridos (*)</p>
        </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de requisitos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden h-fit sticky top-6"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-lg bg-white flex items-center justify-center shadow-md">
                  <img src={requirements.logo} alt="Company Logo" className="h-12 w-12 object-contain" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{requirements.title}</h2>
                  <p className="text-indigo-100 text-sm">{requirements.education}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-indigo-500" />
                  Requisitos Principales
                </h3>
                <div className="space-y-2 pl-7">
                  <RequirementCheck met={formik.values.experience ? parseInt(formik.values.experience) >= requirements.experience : false}>
                    <span className="font-medium">Experiencia:</span> Mínimo {requirements.experience} años
                    {formik.values.experience && (
                      <span className="ml-2">(Tienes: {formik.values.experience})</span>
                    )}
                  </RequirementCheck>
                  
                  <RequirementCheck met={formik.values.education ? 
                    requirements.education.split(',').some(edu => 
                      formik.values.education.toLowerCase().includes(edu.toLowerCase().trim())
                    ) : false
                  }>
                    <span className="font-medium">Educación:</span> {requirements.education}
                  </RequirementCheck>
                  
                  <RequirementCheck met={formik.values.salaryExpectation ? 
                    parseInt(formik.values.salaryExpectation) >= requirements.minSalary && 
                    parseInt(formik.values.salaryExpectation) <= requirements.maxSalary : false}>
                    <span className="font-medium">Salario:</span> ${requirements.minSalary.toLocaleString()} - ${requirements.maxSalary.toLocaleString()}
                    {formik.values.salaryExpectation && (
                      <span className="ml-2">(Ofreces: ${parseInt(formik.values.salaryExpectation).toLocaleString()})</span>
                    )}
                  </RequirementCheck>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-500" />
                  Funciones Clave
                </h3>
                <ul className="pl-7 space-y-2 list-disc text-gray-700">
                  {requirements.responsibilities.map((resp, i) => (
                    <li key={i} className="text-sm">{resp}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-500" />
                  Habilidades Requeridas
                </h3>
                <div className="flex flex-wrap gap-2 pl-7">
                  {displayedSkills.map((skill, i) => {
                    const hasSkill = formik.values.skills && 
                                    formik.values.skills.toLowerCase().includes(skill.toLowerCase());
                    return (
                      <span 
                        key={i} 
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          hasSkill ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                  {requirements.skills.length > 5 && (
                    <button 
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {showAllSkills ? 'Mostrar menos' : `Mostrar todas (${requirements.skills.length})`}
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Tu compatibilidad</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${calculateCompatibility(formik.values)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {calculateCompatibility(formik.values)}% de coincidencia con el puesto
                </p>
              </div>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {submitStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 text-center"
                >
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Aplicación Exitosa!</h2>
                  <p className="text-gray-600 mb-6">
                    Hemos recibido tu aplicación para {requirements.title}. 
                    Revisaremos tu información y nos pondremos en contacto contigo en los próximos 3-5 días hábiles.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => navigate('/hr-jobs')}
                      className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Ver más oportunidades <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                    <button
                      onClick={() => {
                        setSubmitStatus('idle');
                        formik.resetForm();
                      }}
                      className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Aplicar a otro puesto
                    </button>
                  </div>
                </motion.div>
              ) : submitStatus === 'rejected' ? (
                <motion.div
                  key="rejected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 text-center"
                >
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                    <X className="h-10 w-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Requisitos No Cumplidos</h2>
                  <p className="text-gray-600 mb-6">
                    Según nuestra evaluación, no cumples con los requisitos mínimos para esta posición.
                    Te recomendamos revisar nuestros otros puestos en Gestión Humana que podrían ajustarse mejor a tu perfil.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Revisar mi aplicación
                    </button>
                    <button
                      onClick={() => navigate('/hr-jobs')}
                      className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Ver otras oportunidades <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={formik.handleSubmit}
                  className="p-6 sm:p-8 space-y-6"
                >
                  {isSubmitting && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Enviando tu aplicación</h3>
                          <p className="text-gray-600 mb-4 text-center">
                            Estamos procesando tu información y verificando tus requisitos...
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 mt-2">{progress}% completado</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo Nombre */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <User className="h-4 w-4 mr-2 text-indigo-500" /> Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-lg border ${
                          formik.touched.name && formik.errors.name 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm p-3`}
                        placeholder="Ej. María González"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                      )}
                    </div>

                    {/* Campo Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-indigo-500" /> Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-lg border ${
                          formik.touched.email && formik.errors.email 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm p-3`}
                        placeholder="Ej. maria@example.com"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                      )}
                    </div>

                    {/* Campo Teléfono */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-indigo-500" /> Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formatPhone(formik.values.phone)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          formik.setFieldValue('phone', value);
                        }}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-lg border ${
                          formik.touched.phone && formik.errors.phone 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm p-3`}
                        placeholder="Ej. (123) 456-7890"
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                      )}
                    </div>

                    {/* Campo Experiencia */}
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-indigo-500" /> Años de Experiencia *
                      </label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        value={formik.values.experience}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-lg border ${
                          formik.touched.experience && formik.errors.experience 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm p-3`}
                        placeholder="Ej. 5"
                        min="0"
                        max="50"
                      />
                      {formik.touched.experience && formik.errors.experience && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.experience}</p>
                      )}
                    </div>

                    {/* Campo Educación */}
                    <div className="md:col-span-2">
                      <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-indigo-500" /> Formación Académica *
                      </label>
                      <input
                        type="text"
                        id="education"
                        name="education"
                        value={formik.values.education}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-lg border ${
                          formik.touched.education && formik.errors.education 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm p-3`}
                        placeholder="Ej. Psicología Organizacional"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Ejemplos: {requirements.education}
                      </p>
                      {formik.touched.education && formik.errors.education && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.education}</p>
                      )}
                    </div>

                    {/* Campo Habilidades */}
                    <div className="md:col-span-2">
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-indigo-500" /> Habilidades en Gestión Humana *
                      </label>
                      <textarea
                        id="skills"
                        name="skills"
                        value={formik.values.skills}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-lg border ${
                          formik.touched.skills && formik.errors.skills 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm p-3`}
                        rows={3}
                        placeholder="Lista tus habilidades separadas por comas (Ej. Reclutamiento, Formación, Evaluación de desempeño)"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Menciona al menos 3 habilidades clave que posees
                      </p>
                      {formik.touched.skills && formik.errors.skills && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.skills}</p>
                      )}
                    </div>

                    {/* Campo Expectativa Salarial */}
                    <div>
                      <label htmlFor="salaryExpectation" className="block text-sm font-medium text-gray-700 mb-1">
                        Expectativa Salarial (USD/mes) *
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="salaryExpectation"
                          name="salaryExpectation"
                          value={formik.values.salaryExpectation}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`block w-full pl-7 pr-12 rounded-lg border ${
                            formik.touched.salaryExpectation && formik.errors.salaryExpectation 
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          } shadow-sm p-3`}
                          placeholder="Ej. 5000"
                          min="1000"
                          max="20000"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">USD</span>
                        </div>
                      </div>
                      {formik.touched.salaryExpectation && formik.errors.salaryExpectation && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.salaryExpectation}</p>
                      )}
                      {formik.values.salaryExpectation && (
                        <p className={`mt-1 text-sm ${
                          parseInt(formik.values.salaryExpectation) >= requirements.minSalary && 
                          parseInt(formik.values.salaryExpectation) <= requirements.maxSalary 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          Rango ofrecido: ${requirements.minSalary.toLocaleString()} - ${requirements.maxSalary.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Campo Disponibilidad */}
                    <div>
                      <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                        Disponibilidad *
                      </label>
                      <select
                        id="availability"
                        name="availability"
                        value={formik.values.availability}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="inmediata">Inmediata</option>
                        <option value="15dias">15 días</option>
                        <option value="1mes">1 mes</option>
                        <option value="negociable">Negociable</option>
                      </select>
                    </div>

                    {/* Campo Idiomas */}
                    <div>
                      <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-1">
                        Idiomas que dominas *
                      </label>
                      <input
                        type="text"
                        id="languages"
                        name="languages"
                        value={formik.values.languages}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-lg border ${
                          formik.touched.languages && formik.errors.languages 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm p-3`}
                        placeholder="Ej. Español, Inglés avanzado"
                      />
                      {formik.touched.languages && formik.errors.languages && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.languages}</p>
                      )}
                    </div>

                    {/* Campo Referencias */}
                    <div className="md:col-span-2">
                      <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-1">
                        Referencias profesionales *
                      </label>
                      <textarea
                        id="references"
                        name="references"
                        value={formik.values.references}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-lg border ${
                          formik.touched.references && formik.errors.references 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm p-3`}
                        rows={3}
                        placeholder="Nombre, cargo, empresa y contacto de al menos 2 referencias"
                      />
                      {formik.touched.references && formik.errors.references && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.references}</p>
                      )}
                    </div>

                    {/* Campo Carta de Presentación */}
                    <div className="md:col-span-2">
                      <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-indigo-500" /> Carta de Presentación *
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formik.values.coverLetter}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full rounded-lg border ${
                          formik.touched.coverLetter && formik.errors.coverLetter 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm p-3`}
                        rows={5}
                        placeholder="Explica por qué eres el candidato ideal para esta posición, destacando tu experiencia en gestión humana..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {formik.values.coverLetter.length}/2000 caracteres (Mínimo 200 caracteres)
                      </p>
                      {formik.touched.coverLetter && formik.errors.coverLetter && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.coverLetter}</p>
                      )}
                    </div>

                    {/* Campo CV */}
                    <div className="md:col-span-2">
                      <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-indigo-500" /> Curriculum Vitae (PDF) *
                      </label>
                      <input
                        type="file"
                        id="resume"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                      />
                      <div className="mt-1 flex items-center">
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="inline-flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Seleccionar Archivo
                        </button>
                        <span className="ml-4 text-sm text-gray-600">
                          {formik.values.resume ? (
                            <span className="text-indigo-600">{formik.values.resume.name}</span>
                          ) : (
                            'Ningún archivo seleccionado'
                          )}
                        </span>
                      </div>
                      {fileError && (
                        <p className="mt-1 text-sm text-red-600">{fileError}</p>
                      )}
                      {formik.touched.resume && formik.errors.resume && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.resume}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Máximo 5MB. Solo se aceptan archivos PDF.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => navigate('/hr-jobs')}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formik.isValid || !formik.dirty}
                      className={`inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 ${
                        isSubmitting || !formik.isValid || !formik.dirty ? 'opacity-70 cursor-not-allowed' : ''
                      } w-full sm:w-auto`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Aplicación <ChevronRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HRManagerApplicationForm;