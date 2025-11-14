import { Facebook, Github, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-money/90">
      <div className="container max-w-6xl py-10 mx-auto">
        <div className="flex flex-col items-center mb-8 space-y-6 md:flex-row md:space-y-0 md:justify-between md:items-start">
          <div className="flex flex-col items-center space-y-8 md:items-start md:space-y-4">
            <div className="h-8">
              <span className="text-default font-molgan font-bold text-3xl">
                WorkHub
              </span>
            </div>
            <div className="flex flex-col items-center space-y-4 font-semibold text-white md:flex-row md:space-y-0 md:space-x-6">
              <div className="h-10 group">
                <a href="#">About</a>
                <div className="mx-2 group-hover:border-b group-hover:border-default"></div>
              </div>
              <div className="h-10 group">
                <a href="#">Careers</a>
                <div className="mx-2 group-hover:border-b group-hover:border-default"></div>
              </div>
              <div className="h-10 group">
                <a href="#">Events</a>
                <div className="mx-2 group-hover:border-b group-hover:border-default"></div>
              </div>
              <div className="h-10 group">
                <a href="#">Products</a>
                <div className="mx-2 group-hover:border-b group-hover:border-default"></div>
              </div>
              <div className="h-10 group">
                <a
                  href="https://www.linkedin.com/in/theocharis-kortsos-426027302/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Copyright
                </a>
                <div className="mx-2 group-hover:border-b group-hover:border-default"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between space-y-4 text-muted">
            <div className="flex items-center justify-center mx-auto space-x-4 md:justify-end md:mx-0">
              <div className="h-8 group">
                <a
                  href="https://github.com/cptkorts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-default transition-all duration-200"
                >
                  <Github className="h-6 w-6 text-hover group-hover:text-white" />
                </a>
              </div>
              <div className="h-8 group">
                <a
                  href="https://www.linkedin.com/in/theocharis-kortsos-426027302/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-default transition-all duration-200"
                >
                  <Linkedin className="h-6 w-6 text-hover group-hover:text-white" />
                </a>
              </div>
              <div className="h-8 group">
                <a
                  href="#"
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-default transition-all duration-200"
                >
                  <Instagram className="h-6 w-6 text-hover group-hover:text-white" />
                </a>
              </div>
              <div className="h-8 group">
                <a
                  href="https://www.facebook.com/people/%CE%98%CE%B5%CE%BF%CF%87%CE%AC%CF%81%CE%B7%CF%82-%CE%9A%CF%8C%CF%81%CF%84%CF%83%CE%BF%CF%82/pfbid02x7NQkJdx6uxW2B7mWdmqmWMZEvjVHtfc1rLcuE7NxBWM3aWjmRTTTbhm4eA4R4hjl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-default transition-all duration-200"
                >
                  <Facebook className="h-6 w-6 text-hover group-hover:text-white" />
                </a>
              </div>
            </div>

            <div className="font-bold">
              &copy; 2025 WorkHub. All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
