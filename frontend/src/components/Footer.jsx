import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About AskMe3MTT</h3>
            <p>
            AskMe3MTT is a platform for sharing knowledge, inspiring others, and
              learning together. Join the community to make an impact!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-yellow-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/questions" className="hover:text-yellow-300">
                  Questions
                </Link>
              </li>
              <li>
                <Link to="/add-question" className="hover:text-yellow-300">
                  Ask a Question
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-yellow-300">
                  Explore
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@3mtt.com"
                  className="hover:text-yellow-300"
                >
                  contact@3mtt.com
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/3mtt"
                  className="hover:text-yellow-300"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/3mtt"
                  className="hover:text-yellow-300"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500">
          &copy; {new Date().getFullYear()} AskMe3MTT. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
