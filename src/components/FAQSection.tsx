'use client'

import { useState, useCallback } from 'react'

interface FAQParagraph {
  text: string
  link?: {
    url: string
    text: string
  }
  textAfter?: string
}

interface FAQItem {
  question: string
  answer: string | FAQParagraph[]
}

const faqData: FAQItem[] = [
  {
    question: 'What is the Disciplinary Action Tracker (DAT) project?',
    answer: [
      {
        text: 'This project examines 30 years of federal, state, and local government disciplinary actions to understand how systems intended to correct misconduct are instead being used to silence employees, retaliate against whistleblowers, and protect those in power.',
      },
      {
        text: 'Woodrow Sanders III founded this project in March 2026 to raise public awareness about federal, state, and local government disciplinary practices. Woodrow has more than twenty years of experience in information technology, having served as a cyber security engineer, cyber security analyst, DevOps specialist, application developer, UNIX administrator, network administrator, and software support specialist for several private and government organizations.',
      },
    ],
  },
  {
    question: 'Why focus on disciplinary actions?',
    answer:
      'When the disciplinary process is abused, taxpayers lose experienced civil servants, agencies face costly legal settlements, and a culture of fear takes root. By studying discipline, we can see clearly where merit-based accountability ends and weaponized management begins.',
  },
  {
    question: 'How will the data be collected?',
    answer:
      'Information on disciplinary actions will be gathered from public agencies using Freedom of Information Act (FOIA) requests and state and local public records laws. Where possible, disciplines will be analyzed alongside outcomes such as resignations, terminations, settlements, and reinstatements.',
  },
  {
    question: 'What do you mean by “weaponized discipline”?',
    answer:
      'Weaponized discipline refers to situations where managers use the disciplinary process—paper trails, investigations, PIPs, reassignments, and “quiet firing”—to punish employees for speaking up or challenging the status quo, rather than to improve performance or address genuine misconduct.',
  },
  {
    question: 'Who can share their experience?',
    answer:
      'Current and former public employees at the federal, state, or local level—as well as witnesses to disciplinary actions—are invited to share what they have seen or experienced, whether they were targets of discipline, coworkers, or union representatives.',
  },
  {
    question: 'How will anonymity and safety be protected?',
    answer:
      'The project encourages contributors to protect their identity where needed. The JustFollowingWoodrow.com platform accepts video and audio submissions with optional digital voice alteration, and stories may be anonymized or de-identified before they are shared publicly.',
  },
  {
    question: 'What inspired this project?',
    answer: [
      {
        text: 'Steven Larson, a former debris operations manager at California’s Office of Emergency Services (Cal OES), alleged mismanagement, overspending, and harassment connected to wildfire cleanup efforts. After raising concerns, he reported facing retaliation, including negative performance reviews and termination. Related Los Angeles Times coverage can be found ',
        link: {
          url: 'https://www.latimes.com/california/story/2025-09-08/whistleblower-trial-reveals-claims-of-mismanagement-overspending-in-california-fire-clean-up',
          text: 'here',
        },
        textAfter: ' and ',
      },
      {
        text: '',
        link: {
          url: 'https://www.latimes.com/environment/story/2026-01-16/leaked-memo-reveals-california-debated-cutting-wildfire-soil-testing-before-disaster-chiefs-exit',
          text: 'here',
        },
        textAfter:
          ', illustrating how discipline and retaliation can be intertwined with larger questions of public safety and accountability.',
      },
      {
        text: 'Woodrow Sanders III is another person who can personally attest to how this weaponization is aimed at employees. During his tenure at the same agency (then known as CalEMA) from 2007 to 2017, he was subjected to a series of escalating adverse actions between 2009 and 2010. The pattern was clear: after two initial adverse actions were eventually withdrawn via a signed settlement agreement, a third attempt—a dismissal—was launched just months later. Like the previous attempts, this third action was also withdrawn through a settlement agreement. This cycle of "charge and withdraw" is a textbook example of how government agencies use the disciplinary system to exhaust an employee\'s resources and resolve.',
      },
    ],
  },
  {
    question: 'How can I follow the project or get involved?',
    answer: [
      {
        text: 'You can sign up ',
        link: {
          url: 'https://DATracker.com',
          text: 'here',
        },
        textAfter:
          ' for a free, guest account. This is a personal project; likewise, you’ll have an opportunity to make a donation when signing up to help cover research efforts, data acquisition costs, and the technology infrastructure for collecting and presenting to the public disciplinary data. Targets and witnesses of disciplinary actions can share their stories and audio/video testimonials here.',
      },
      {
        text: 'Records received from federal, state, and local government agencies are the backbone of this project; you can e-mail and call to demand that your elected officials and government officials respond to our requests for information.',
      },
    ],
  },
]

/**
 * FAQSection component displaying frequently asked questions in a simple accordion format.
 * Inspired by Buy Me a Coffee's FAQ implementation.
 * 
 * @returns JSX element containing the FAQ section
 */
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = useCallback((index: number, event?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      toggleItem(index, event)
    }
  }, [toggleItem])

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault()
    event.stopPropagation()
    toggleItem(index, event)
  }, [toggleItem])

  return (
    <section id="faqs" className="mt-8 md:mt-12 pt-8 pb-8 mb-8 md:mb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-california-blue">FAQ</span>
              <span className="text-emergency-orange">S</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  key={index}
                  className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                >
                  <button
                    onClick={(e) => handleClick(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full text-left flex items-center justify-between py-3 group focus:outline-none focus:ring-2 focus:ring-california-blue focus:ring-offset-2 rounded-md px-2 -mx-2 transition-colors duration-200"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 pr-4 group-hover:text-california-blue transition-colors duration-200">
                      {item.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-california-blue flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    {typeof item.answer === 'string' ? (
                      <p className="text-gray-600 leading-relaxed pt-2 pb-4 text-base md:text-lg">
                        {item.answer}
                      </p>
                    ) : (
                      <div className="pt-2 pb-4 space-y-4">
                        {item.answer.map((paragraph, paraIndex) => (
                          <p key={paraIndex} className="text-gray-600 leading-relaxed text-base md:text-lg">
                            {paragraph.text}
                            {paragraph.link && (
                              <a
                                href={paragraph.link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-california-blue hover:text-california-gold underline transition-colors duration-200"
                              >
                                {paragraph.link.text}
                              </a>
                            )}
                            {paragraph.textAfter}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
