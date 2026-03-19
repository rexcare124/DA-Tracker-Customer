'use client'

/**
 * KeyIssuesSection component displaying three key issues cards (Mismanagement, Transparency, Efficiency).
 * 
 * @returns JSX element containing the Key Issues section
 */
export default function KeyIssuesSection() {
  return (
    <section id="about" className="mt-8 md:mt-12 pt-8 pb-8 mb-8 md:mb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-6xl mx-auto leading-relaxed">
            Quality public services depend on{' '}
            <span className="text-california-gold font-semibold">competent leadership</span>,{' '}
            <span className="text-fire-red font-semibold">sound policies</span>, and{' '}
            <span className="text-emergency-orange font-semibold">public servants with good character and emotional maturity</span>.
            If one of those legs is weak or missing, service delivery suffers and accountability breaks down.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-fire-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-fire-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Weaponized Discipline</h3>
            <p className="text-gray-600 text-sm">
              Track how fabricated paper trails, vague PIPs, and stacked documentation are used to push out targeted employees.
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-california-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-california-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Retaliation & Silencing</h3>
            <p className="text-gray-600 text-sm">
              Identify patterns where whistleblowers and high performers are disciplined while favored employees are shielded.
            </p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emergency-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emergency-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Taxpayer Cost</h3>
            <p className="text-gray-600 text-sm">
              Examine the financial, legal, and human cost of abusive discipline across federal, state, and local agencies.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
