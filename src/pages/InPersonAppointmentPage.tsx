import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';  // <-- Add this import
import 'react-datepicker/dist/react-datepicker.css';  // <-- Add this import

import { supabase } from '../lib/supabase';
import { useSupabaseUser } from '../hooks/useSupabaseUser';
import FormField from '../components/ui/FormField';
import { InPersonAppointment } from '../types';

export default function InPersonAppointmentPage() {
  const currentUser = useSupabaseUser();
  const navigate = useNavigate();

  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InPersonAppointment>();

  const specializations = [
    'General Physician',
    'Mental Health',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'Neurology',
    'Gynecology',
    'Urology',
    'Other',
  ];

  const onSubmit = async (data: InPersonAppointment) => {
    if (!appointmentDate) return;
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const { error, data: inserted } = await supabase.from('in_person_appointments').insert([
        {
          ...data,
          appointmentDateTime: appointmentDate.toISOString(),
          userId: currentUser.id,
          status: 'scheduled',
        },
      ]).select().single();

      if (error) throw error;

      setSuccess(true);
      reset();
      setAppointmentDate(null);

      setTimeout(() => {
        navigate('/confirmation', {
          state: {
            type: 'inPerson',
            id: inserted.id,
            patientName: data.fullName,
            appointmentDateTime: appointmentDate,
            specialization: data.specialization,
          },
        });
      }, 2000);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Appointment Scheduled!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Your in-person appointment has been booked successfully. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sm:p-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Schedule an In-Person Appointment
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Meet with our healthcare professionals in person at our clinic
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <FormField
                id="fullName"
                label="Full Name"
                type="text"
                register={register}
                errors={errors}
                validationRules={{ required: 'Full name is required' }}
                placeholder="John Doe"
              />

              <FormField
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                register={register}
                errors={errors}
                validationRules={{ required: 'Date of birth is required' }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  register={register}
                  errors={errors}
                  validationRules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+-]+$/,
                      message: 'Please enter a valid phone number',
                    },
                  }}
                  placeholder="(555) 123-4567"
                />

                <FormField
                  id="email"
                  label="Email Address"
                  type="email"
                  register={register}
                  errors={errors}
                  validationRules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  }}
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specialization
                </label>
                <select
                  id="specialization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  {...register('specialization', { required: 'Please select a specialization' })}
                >
                  <option value="">Select a specialization</option>
                  {specializations.map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
                {errors.specialization && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.specialization.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="appointmentDateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Appointment Date and Time
                </label>
                <DatePicker
                  selected={appointmentDate}
                  onChange={(date) => setAppointmentDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholderText="Select date and time"
                />
                {!appointmentDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">Please select a date and time</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !appointmentDate}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
