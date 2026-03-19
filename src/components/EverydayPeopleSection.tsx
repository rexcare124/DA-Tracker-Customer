'use client'

/**
 * EverydayPeopleSection component displaying a call-to-action for citizen engagement.
 * 
 * @returns JSX element containing the "Everyday People Effecting Change" section
 */
export default function EverydayPeopleSection() {
  return (
    <section id="everyday-people" className="mt-8 md:mt-12 pt-8 pb-8 mb-8 md:mb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-california-blue">Share</span>
              <span className="text-emergency-orange"> Testimonial</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Targets and witnesses of government disciplinary actions are invited to share their experiences. Your testimony helps
              expose patterns of abuse that would otherwise remain buried in personnel files.
            </p>
            <div id="referendums" className="flex justify-center">
              <a
                href="https://JustFollowingWoodrow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Submit Your Experience
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
