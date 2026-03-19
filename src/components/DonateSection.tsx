'use client'

import { useState } from 'react'

type Frequency = 'one-time' | 'monthly' | 'annual'

const AMOUNTS = [2.75, 5, 10, 20, 30, 50, 100] as const

export default function DonateSection() {
  const [frequency, setFrequency] = useState<Frequency>('one-time')
  const [selectedAmount, setSelectedAmount] = useState<number | 'other'>(10)

  return (
    <section id="donate" className="mt-8 md:mt-12 pt-8 pb-8 mb-8 md:mb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">
              <span className="text-california-blue">Support</span>{' '}
              <span className="text-emergency-orange">DATracker</span>
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-base md:text-lg">
              Help sustain this independent, community-driven project to analyze how ethically and impartially government agencies wield their unchecked disciplinary authority. Your
              donation helps cover research time, data acquisition costs, and technology for collecting and presenting
              curated data.
            </p>
          </div>

          {/* Frequency toggle */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Donation frequency
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {(
                [
                  { id: 'one-time', label: 'One-time' },
                  { id: 'monthly', label: 'Monthly' },
                  { id: 'annual', label: 'Annual' },
                ] as const
              ).map((option) => {
                const isActive = frequency === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFrequency(option.id)}
                    className={`rounded-lg border px-3 py-2 text-sm md:text-base font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'bg-california-blue text-white border-california-blue'
                        : 'bg-white/80 text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Amount grid */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Donation amount (USD)
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {AMOUNTS.map((amount) => {
                const isActive = selectedAmount === amount
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'bg-emergency-orange text-white border-emergency-orange'
                        : 'bg-white/80 text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    ${amount.toFixed(2)}
                  </button>
                )
              })}
              <div className="flex items-center gap-2 col-span-3 sm:col-span-1">
                <button
                  type="button"
                  onClick={() => setSelectedAmount('other')}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                    selectedAmount === 'other'
                      ? 'bg-emergency-orange text-white border-emergency-orange'
                      : 'bg-white/80 text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Other
                </button>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  className="flex-1 form-input text-sm"
                  placeholder="USD"
                  onFocus={() => setSelectedAmount('other')}
                  aria-label="Other donation amount in US dollars"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              This is a design prototype only; payment processing is not yet enabled.
            </p>
          </div>

          {/* Payment methods */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white/90 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Credit / Debit Card
              </span>
              <span className="flex items-center gap-2 text-base">
                <span className="text-blue-600 font-bold">VISA</span>
                <span className="text-red-500 font-bold">Mastercard</span>
                <span className="text-blue-800 font-bold">AmEx</span>
                <span className="text-orange-500 font-bold">Discover</span>
              </span>
            </button>

            <button
              type="button"
              className="w-full rounded-lg border border-gray-300 bg-white/90 py-3 text-lg font-bold text-[#003087] hover:bg-gray-50 transition-colors duration-200"
            >
              PayPal
            </button>

            <button
              type="button"
              className="w-full rounded-lg border border-gray-300 bg-white/90 py-3 text-lg font-extrabold text-[#008CFF] uppercase tracking-wide hover:bg-gray-50 transition-colors duration-200"
            >
              venmo
            </button>

            <button
              type="button"
              className="w-full rounded-lg border border-gray-300 bg-white/90 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-2xl"></span>
              <span>Pay</span>
            </button>

            <button
              type="button"
              className="w-full rounded-full border border-gray-300 bg-white/90 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                <span className="text-xs font-bold text-[#4285F4]">G</span>
              </span>
              <span>Pay</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

