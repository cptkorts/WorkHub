import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="h-screen w-full flex flex-col">
      <div className="flex-1 flex gap-10 items-center justify-center p-10">
        <div className="flex flex-col gap-5 w-2/5 justify-center">
          <div className="flex flex-col gap-3 justify-center">
            <h1 className="text-5xl font-extrabold font-molgan text-text-default mb-4">
              WorkHub
            </h1>
            <h2 className="text-2xl font-semibold text-hover mb-6">
              One dashboard. Every client. Every invoice.
            </h2>
            <h4 className="text-base text-success leading-relaxed max-w-md">
              WorkHub brings clients, appointments, and invoices together, so
              you can focus on what you do best.
            </h4>
          </div>
          <div className="flex gap-6">
            <Link
              href="/signup"
              className="relative lg:w-36 lg:h-14 md:w-28 md:h-10 w-28 h-12 shadow-md hover:shadow-lg transition-all duration-400 bg-success border-2 border-money/80 text-white font-semibold rounded-lg hover:rounded-xl overflow-hidden group flex items-center justify-center text-sm sm:text-base"
            >
              <span className="hidden lg:flex absolute inset-0 items-center justify-center transition-transform duration-400 group-hover:-translate-y-full">
                Get Started
              </span>
              <span className="hidden lg:flex absolute inset-0 items-center justify-center translate-y-full transition-transform duration-400 group-hover:translate-y-0">
                Today!
              </span>

              <span className="lg:hidden flex items-center justify-center w-full h-full">
                Get Started
              </span>
            </Link>
            <Link
              href="/#workhub"
              className="relative group py-3 px-6 text-default flex items-center justify-center"
            >
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-success group-hover:w-full transition-all duration-300"></span>
              <span className="flex gap-2 items-center">
                Learn More
                <ChevronDown className="opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all duration-300" />
              </span>
            </Link>
          </div>
        </div>
        <div>
          <div className="relative mx-auto border-text-default bg-gray-800 border-16 rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-lg">
            <div className="rounded-xl overflow-hidden h-[140px] md:h-[262px]">
              <Image
                src={"/images/workhub-screenshot.webp"}
                alt="WorkHub dashboard Screenshot"
                width={600}
                height={400}
              />
            </div>
          </div>
          <div className="relative mx-auto bg-money/50 dark:bg-gray-700 rounded-b-xl h-6 max-w-[301px] md:h-[42px] md:max-w-lg"></div>
          <div className="relative mx-auto bg-money rounded-b-xl h-8 max-w-[83px] md:h-18 mx-w-[152px]"></div>
        </div>
      </div>
      <div className="mt-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-24 md:h-32"
          preserveAspectRatio="none"
        >
          <path
            fill="#a8c686"
            fillOpacity="0.8"
            d="M0,96L26.7,96C53.3,96,107,96,160,101.3C213.3,107,267,117,320,133.3C373.3,149,427,171,480,154.7C533.3,139,587,85,640,101.3C693.3,117,747,203,800,224C853.3,245,907,203,960,186.7C1013.3,171,1067,181,1120,186.7C1173.3,192,1227,192,1280,186.7C1333.3,181,1387,171,1413,165.3L1440,160L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
