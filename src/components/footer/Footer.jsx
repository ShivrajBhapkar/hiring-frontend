import React from "react";
const Footer = () => {
    return (
        <div className="bg-gray-900 text-white p-4 text-center">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-x-4">
                <div>
                    <p>Email: shivrajofficial102@gmail.com</p>
                    <p>Phone: +918668236550</p>
                </div>
                <div>
                    <a
                        href="https://www.linkedin.com/in/shivraj-bhapkar102/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
