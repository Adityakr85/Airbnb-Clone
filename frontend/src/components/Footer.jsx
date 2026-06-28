import { Globe } from "lucide-react";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#f7f7f7] border-t border-gray-200 px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
       <div>
          <h3 className="font-semibold mb-4">Support</h3>
          {[
            { name: "Help Centre", path:"/help"},
            { name: "Get help with a safety issue", path: "pages/User/Messages" },
            { name: "AirCover", path: "/help/article/2" },
            { name: "Anti-discrimination", path: "/help/search?q=discrimination" },
            { name: "Disability support", path: "/help/search?q=disability" },
            { name: "Cancellation options", path: "/help/search?q=cancellations" },
            { name: "Report neighbourhood concern", path: "/help/search?q=neighbourhood" },
          ].map((item) => (
            item.path ? (
              <Link 
                key={item.name} 
                to={item.path} 
                className="block mb-4 text-sm hover:underline cursor-pointer"
              >
                {item.name}
              </Link>
            ) : (
              <p
                key={item.name}
                className="mb-4 text-sm hover:underline cursor-pointer"
              >
                {item.name}
              </p>
            )
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-4">Hosting</h3>
          {[
            { name: "Airbnb your home", path: "/become-a-host" },
            { name: "Airbnb your experience", path: "/become-a-host" },
            { name: "Airbnb your service", path: "/become-a-host" },
            { name: "AirCover for Hosts", path: "/help/search?q=AirCover+for+Hosts" },
            { name: "Hosting resources", path: null },
            { name: "Community forum", path: null },
            { name: "Hosting responsibly", path: "/help/search?q=responsible" },
            { name: "Join a free hosting class", path: null },
            { name: "Find a co-host", path: null },
            { name: "Refer a host", path: null },
          ].map((item) => (
            item.path ? (
              <Link 
                key={item.name} 
                to={item.path} 
                className="block mb-4 text-sm hover:underline cursor-pointer"
              >
                {item.name}
              </Link>
            ) : (
              <p
                key={item.name}
                className="mb-4 text-sm hover:underline cursor-pointer"
              >
                {item.name}
              </p>
            )
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
