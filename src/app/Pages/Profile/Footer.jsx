"use client";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

                {/* Brand & Description */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">MegaMart</h2>
                    <p className="text-gray-300">
                        Your one-stop shop for groceries, electronics, fashion, and more.
                        Fast delivery, easy checkout, and trusted vendors.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-blue-500">
                            <FaFacebookF className="w-6 h-6" />
                        </a>
                        <a href="#" className="hover:text-blue-500">
                            <FaTwitter className="w-6 h-6" />
                        </a>
                        <a href="#" className="hover:text-blue-500">
                            <FaInstagram className="w-6 h-6" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>
                            <Link href="/" className="hover:text-blue-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/Pages/Profile" className="hover:text-blue-300">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/Pages/Cart" className="hover:text-blue-300">
                                Cart
                            </Link>
                        </li>
                        <li>
                            <Link href="/Pages/HomeProducts" className="hover:text-blue-300">
                                Categories
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="font-semibold mb-4 text-white">Contact Us</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                            <PhoneIcon className="w-5 h-5 text-blue-300" />
                            +234 800 123 4567
                        </li>
                        <li className="flex items-center gap-2">
                            <EnvelopeIcon className="w-5 h-5 text-blue-300" />
                            support@megamart.com
                        </li>
                        <li>Mon-Fri: 9am - 6pm</li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="font-semibold mb-4 text-white">Subscribe</h3>
                    <p className="text-gray-300 mb-2">Get updates on new products and offers.</p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="px-3 py-2 rounded-xl text-black w-full sm:w-auto flex-1"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition text-white"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-700 mt-8 py-4 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} MegaMart. All rights reserved. Made with ❤️ for users.
            </div>
        </footer>
    );
}
