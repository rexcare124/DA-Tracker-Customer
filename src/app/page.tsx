import ContactForm from '@/components/ContactForm'
import DonateSection from '@/components/DonateSection'
import EverydayPeopleSection from '@/components/EverydayPeopleSection'
import FAQSection from '@/components/FAQSection'
import KeyIssuesSection from '@/components/KeyIssuesSection'
import RealTimeDataMap from '@/components/RealTimeDataMap'
import Image from 'next/image'
import { FaYoutube, FaInstagram, FaFacebookF, FaTiktok, FaPinterestP } from 'react-icons/fa'
import { SiX } from 'react-icons/si'

const socialLinks = [
  {
    icon: FaFacebookF,
    href: 'https://www.facebook.com/PlentiKnowledge',
    label: 'Facebook',
  },
  {
    icon: SiX,
    href: 'https://x.com/PlentiKnowledge',
    label: 'X (Twitter)',
  },
  {
    icon: FaYoutube,
    href: 'https://www.youtube.com/@PlentiKnowledge',
    label: 'YouTube',
  },
  {
    icon: FaInstagram,
    href: 'https://www.instagram.com/plentiknowledge',
    label: 'Instagram',
  },
  {
    icon: FaTiktok,
    href: 'https://www.tiktok.com/@plenti_knowledge',
    label: 'TikTok',
  },
  {
    icon: FaPinterestP,
    href: 'https://www.pinterest.com/PlentiKnowledge',
    label: 'Pinterest',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen hero-bg">

      {/* Main Content */}
      <div id="home" className="relative z-10 container mx-auto px-4 pt-24 md:pt-28 pb-12">
        <div className="text-center mb-8 md:mb-12">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 flex items-center justify-center">
              <Image
                src="/images/public-services-stool-900.png"
                alt="Public Services Stool"
                width={256}
                height={256}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Key Issues Section */}
        <KeyIssuesSection />

        {/* Everyday People Effecting Change Section */}
        <EverydayPeopleSection />

        {/* Real-Time Data Map Section */}
        <section id="view-data" className="mt-8 md:mt-12 pt-8 pb-8 mb-8 md:mb-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <RealTimeDataMap />
          </div>
        </section>

        {/* Donate Section */}
        <DonateSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Social + Legal Links */}
        <section className="mt-8 md:mt-12 pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 md:w-12 md:h-12 bg-[#2d4093]/20 hover:bg-[#2d4093]/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/10 hover:border-[#262c5b]/50 shadow-lg hover:shadow-xl"
                  >
                    <IconComponent className="text-white" size={18} />
                  </a>
                )
              })}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <a
                href="/terms"
                className="hover:text-california-blue underline-offset-4 hover:underline"
              >
                Terms
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="/privacy"
                className="hover:text-california-blue underline-offset-4 hover:underline"
              >
                Privacy
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-8 md:mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 text-sm">
            © 2026 Woodrow Sanders III. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  )
}
