import Image from "next/image";
import Link from "next/link";

import { FaGithub } from "react-icons/fa";
import { FaXTwitter, FaReact, FaFacebookF, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer>
      <div className="max-w-screen-xl h-full mx-auto border-t px-3">
        {/* <!-- Footer Bottom --> */}
        <div className="flex flex-col items-center justify-center gap-4 border-t border-dark-500 py-5 w-full mx-auto">
          <div className="flex">
            <ul className="flex items-center gap-8 text-sm">
              <li>
                <Link href="/" className="hover:text-primary">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex justify-center text-sm">
            <p>&copy; 2024 Graduation thesis</p>
          </div>
          <div className="flex justify-end">
            <ul className="flex items-center gap-4">
              <li>
                <Link href="https://github.com/anhuong541" target="_blank">
                  <FaGithub className="w-5 h-5" />
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com/nguynxunnhng1" target="_blank">
                  <FaXTwitter className="w-5 h-5" />
                </Link>
              </li>
              <li>
                <Link href="https://www.facebook.com/" target="_blank">
                  <FaFacebookF className="w-5 h-5" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/huong-nguyen-xuan/"
                  target="_blank"
                >
                  <FaLinkedin className="w-5 h-5" />
                </Link>
              </li>
              <li>
                <Link href="https://react.dev/" target="_blank">
                  <FaReact className="w-5 h-5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* <!-- Footer Bottom --> */}
      </div>
    </footer>
  );
}
