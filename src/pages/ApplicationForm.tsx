// src/pages/ApplicationForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Phone, Briefcase, BookOpen, Users, FileText, Upload, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { JOB_LISTINGS } from './Jobs';

const HRManagerApplicationForm = () => {
  const { jobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'rejected'>('idle');

  const job = JOB_LISTINGS.find(j => j.id === parseInt(jobId || ''));

  useEffect(() => {
    if (!job) navigate('/hr-jobs', { replace: true });
  }, [job, navigate]);

  const formik = useFormik({
    initialValues: {
      name: '', email: '', phone: '', experience: '', education: '',
      skills: '', resume: null, coverLetter: '', availability: '',
      salary: '', languages: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      phone: Yup.string().required(),
      experience: Yup.string().required(),
      education: Yup.string().required(),
      skills: Yup.string().required(),
      resume: Yup.mixed().required(),
      coverLetter: Yup.string().required().min(100),
      availability: Yup.string().required(),
      salary: Yup.string().required(),
      languages: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      setSubmitStatus('success');
    }
  });

  if (!job) return null;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Aplicar a: <span className="text-indigo-600">{job.title}</span>
        </h1>

        {submitStatus === 'success' ? (
          <div className="text-center">
            <p className="text-green-600 text-lg font-medium mb-4">¡Aplicación enviada con éxito!</p>
            <button onClick={() => navigate('/hr-jobs')} className="text-indigo-600 underline">
              Volver a vacantes
            </button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium flex items-center text-gray-700"><User className="w-4 h-4 mr-1" /> Nombre</label>
                <input type="text" name="name" onChange={formik.handleChange} value={formik.values.name} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="font-medium flex items-center text-gray-700"><Mail className="w-4 h-4 mr-1" /> Email</label>
                <input type="email" name="email" onChange={formik.handleChange} value={formik.values.email} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="font-medium flex items-center text-gray-700"><Phone className="w-4 h-4 mr-1" /> Teléfono</label>
                <input type="tel" name="phone" onChange={formik.handleChange} value={formik.values.phone} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="font-medium flex items-center text-gray-700"><Briefcase className="w-4 h-4 mr-1" /> Años experiencia</label>
                <input type="number" name="experience" onChange={formik.handleChange} value={formik.values.experience} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="md:col-span-2">
                <label className="font-medium flex items-center text-gray-700"><BookOpen className="w-4 h-4 mr-1" /> Educación</label>
                <input type="text" name="education" onChange={formik.handleChange} value={formik.values.education} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            <div>
              <label className="font-medium flex items-center text-gray-700"><Users className="w-4 h-4 mr-1" /> Habilidades</label>
              <input type="text" name="skills" onChange={formik.handleChange} value={formik.values.skills} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="font-medium text-gray-700">Carta de Presentación</label>
              <textarea name="coverLetter" onChange={formik.handleChange} value={formik.values.coverLetter} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={4} />
            </div>

            <div>
              <label className="font-medium text-gray-700">Disponibilidad</label>
              <select name="availability" onChange={formik.handleChange} value={formik.values.availability} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Seleccione...</option>
                <option value="inmediata">Inmediata</option>
                <option value="15dias">15 días</option>
                <option value="1mes">1 mes</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-gray-700">Salario Esperado (USD)</label>
              <input type="number" name="salary" onChange={formik.handleChange} value={formik.values.salary} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="font-medium text-gray-700">Idiomas</label>
              <input type="text" name="languages" onChange={formik.handleChange} value={formik.values.languages} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="font-medium flex items-center text-gray-700"><FileText className="w-4 h-4 mr-1" /> CV (PDF)</label>
              <input type="file" ref={fileInputRef} onChange={(e) => formik.setFieldValue('resume', e.currentTarget.files?.[0])} className="input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 inline-block" /> : 'Enviar Aplicación'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HRManagerApplicationForm;
