'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

const FORM_SUBMISSION_DELAY_MS = 1000

interface FormData {
  firstName: string
  lastName: string
  subject: string
  contactMethod: 'email' | 'phone'
  email?: string
  confirmEmail?: string
  phone?: string
  confirmPhone?: string
  message: string
}

/**
 * ContactForm component for collecting user contact information and messages.
 * Supports both email and phone contact methods with validation.
 * 
 * @returns JSX element containing the contact form
 */
export default function ContactForm() {
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>()

  const email = watch('email')
  const confirmEmail = watch('confirmEmail')
  const phone = watch('phone')
  const confirmPhone = watch('confirmPhone')

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, FORM_SUBMISSION_DELAY_MS))
      
      setSubmitStatus('success')
      reset()
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Validates that the email confirmation matches the original email.
   * 
   * @param value - The email confirmation value to validate
   * @returns True if valid, error message string if invalid
   */
  const validateEmailMatch = (value: string | undefined): boolean | string => {
    if (contactMethod === 'email' && value !== email) {
      return 'Email addresses must match'
    }
    return true
  }

  /**
   * Validates that the phone confirmation matches the original phone.
   * 
   * @param value - The phone confirmation value to validate
   * @returns True if valid, error message string if invalid
   */
  const validatePhoneMatch = (value: string | undefined): boolean | string => {
    if (contactMethod === 'phone' && value !== phone) {
      return 'Phone numbers must match'
    }
    return true
  }

  /**
   * Validates that the message length does not exceed the maximum.
   * 
   * @param value - The message value to validate
   * @returns True if valid, error message string if invalid
   */
  const validateMessageLength = (value: string | undefined): boolean | string => {
    if (value && value.length > 500) {
      return 'Message must be 500 characters or less'
    }
    return true
  }

  /**
   * Validates that the subject length does not exceed the maximum.
   * 
   * @param value - The subject value to validate
   * @returns True if valid, error message string if invalid
   */
  const validateSubjectLength = (value: string | undefined): boolean | string => {
    if (value && value.length > 50) {
      return 'Subject must be 50 characters or less'
    }
    return true
  }

  /**
   * Formats a phone number string to (XXX) XXX-XXXX format.
   * 
   * @param value - The raw phone number string to format
   * @returns Formatted phone number string
   */
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '')
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    } else if (phoneNumber.length > 0) {
      return `(${phoneNumber}`
    }
    return phoneNumber
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    e.target.value = formatted
  }

  return (
    <div className="w-full mx-auto">
      <div className="glass-effect rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
          Real-Time Data Map
        </h2>
        
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Thank you for your interest! We'll be in touch soon.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            There was an error submitting your form. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your first name"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your last name"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="form-label">Subject *</label>
            <input
              type="text"
              className="form-input"
              placeholder="What would you like to discuss?"
              maxLength={50}
              {...register('subject', { 
                required: 'Subject is required',
                validate: validateSubjectLength
              })}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.subject && (
                <p className="text-red-500 text-sm">{errors.subject.message}</p>
              )}
              <p className="text-gray-400 text-sm ml-auto">
                {watch('subject')?.length || 0}/50 characters
              </p>
            </div>
          </div>

          {/* Contact Method */}
          <div>
            <label className="form-label">Preferred Contact Method *</label>
            <select
              className="form-input"
              {...register('contactMethod', { required: 'Contact method is required' })}
              onChange={(e) => setContactMethod(e.target.value as 'email' | 'phone')}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
            {errors.contactMethod && (
              <p className="text-red-500 text-sm mt-1">{errors.contactMethod.message}</p>
            )}
          </div>

          {/* Conditional Contact Fields */}
          {contactMethod === 'email' ? (
            <>
              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="form-label">Confirm Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Confirm your email address"
                  {...register('confirmEmail', { 
                    required: 'Email confirmation is required',
                    validate: validateEmailMatch
                  })}
                />
                {errors.confirmEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmEmail.message}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="(555) 123-4567"
                  maxLength={14}
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\(\d{3}\) \d{3}-\d{4}$/,
                      message: 'Please enter a valid phone number'
                    },
                    onChange: handlePhoneChange
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="form-label">Confirm Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="(555) 123-4567"
                  maxLength={14}
                  {...register('confirmPhone', { 
                    required: 'Phone confirmation is required',
                    validate: validatePhoneMatch,
                    onChange: handlePhoneChange
                  })}
                />
                {errors.confirmPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPhone.message}</p>
                )}
              </div>
            </>
          )}

          {/* Message */}
          <div>
            <label className="form-label">Message *</label>
            <textarea
              className="form-input min-h-[120px] resize-none"
              placeholder="Tell us why you're interested in government transparency and accountability and how you'd like to help..."
              maxLength={500}
              {...register('message', { 
                required: 'Message is required',
                validate: validateMessageLength
              })}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message.message}</p>
              )}
              <p className="text-gray-400 text-sm ml-auto">
                {watch('message')?.length || 0}/500 characters
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Peruse the Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
