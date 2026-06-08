import { Globe } from "lucide-react";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#f7f7f7] border-t border-gray-200 px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          {[
            "Help Centre",
            "Get help with a safety issue",
            "AirCover",
            "Anti-discrimination",
            "Disability support",
            "Cancellation options",
            "Report neighbourhood concern",
          ].map((item) => (
            <p
              key={item}
              className="mb-4 text-sm hover:underline cursor-pointer"
            >
              {item}
            </p>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-4">Hosting</h3>
          {[
            "Airbnb your home",
            "Airbnb your experience",
            "Airbnb your service",
            "AirCover for Hosts",
            "Hosting resources",
            "Community forum",
            "Hosting responsibly",
            "Join a free hosting class",
            "Find a co-host",
            "Refer a host",
          ].map((item) => (
            <p
              key={item}
              className="mb-4 text-sm hover:underline cursor-pointer"
            >
              {item}
            </p>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-4">Airbnb</h3>
          {[
            "2026 Summer Release",
            "Newsroom",
            "Careers",
            "Investors",
            "Airbnb.org emergency stays",
          ].map((item) => (
            <p
              key={item}
              className="mb-4 text-sm hover:underline cursor-pointer"
            >
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between gap-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <span>© 2026 Airbnb, Inc.</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">
            Company details
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2">
            <Globe size={17} /> English (IN)
          </span>
          <span>₹ INR</span>
          <FaFacebook size={18} />
          <FaXTwitter size={17} />
          <FaInstagram size={18} />
        </div>
      </div>
    </footer>
  );
}
