import { FaYoutube, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import { SiX } from "react-icons/si"; // For the X (Twitter) logo

export default function SocialIcons() {
  const socialLinks = [
    {
      icon: FaFacebookF, // Font Awesome Facebook icon
      href: "https://www.facebook.com", // Replace with your Facebook link
      label: "Facebook",
    },
    {
      icon: SiX, // Simple Icons X (Twitter) icon
      href: "https://x.com", // Replace with your X (Twitter) link
      label: "X (Twitter)",
    },
    {
      icon: FaYoutube, // Font Awesome YouTube icon
      href: "https://www.youtube.com", // Replace with your YouTube link
      label: "YouTube",
    },
    {
      icon: FaInstagram, // Font Awesome Instagram icon
      href: "https://www.instagram.com", // Replace with your Instagram link
      label: "Instagram",
    },
    {
      icon: FaTiktok, // Font Awesome TikTok icon
      href: "https://www.tiktok.com", // Replace with your TikTok link
      label: "TikTok",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4 my-5">
      {socialLinks.map((social, index) => {
        const IconComponent = social.icon;
        return (
          <a
            key={index}
            href={social.href}
            target="_blank"
            aria-label={social.label}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2d4093]/20 hover:bg-[#2d4093]/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/10 hover:border-[#262c5b]/50 shadow-lg hover:shadow-xl"
          >
            {/* React Icons components generally don't take `className` for size directly.
                Instead, you can pass a `size` prop or apply styling to the parent.
                For consistency with your previous setup, we'll keep the text-white on the icon.
                The size is handled by the parent `a` tag's flexbox centering. */}
            <IconComponent className="text-white" size={20} />{" "}
            {/* Adjust size as needed */}
          </a>
        );
      })}
    </div>
  );
}
