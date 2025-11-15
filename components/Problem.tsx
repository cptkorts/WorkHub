import { Calendar, Hourglass, Mail, Settings } from "lucide-react";
import Image from "next/image";

export default function Problem() {
  return (
    <section
      id="workhub"
      className="min-h-screen w-full flex flex-col border-b border-border"
    >
      <div className="leading-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-24 md:h-32 block align-bottom"
          preserveAspectRatio="none"
        >
          <path
            fill="#a8c686"
            fillOpacity="0.8"
            d="M0,160L34.3,154.7C68.6,149,137,139,206,154.7C274.3,171,343,213,411,208C480,203,549,149,617,128C685.7,107,754,117,823,133.3C891.4,149,960,171,1029,186.7C1097.1,203,1166,213,1234,218.7C1302.9,224,1371,224,1406,224L1440,224L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
          ></path>
        </svg>
      </div>
      <div className="flex flex-col xl:flex-row gap-10 items-center justify-center p-5 xl:p-10">
        <div className="xl:w-1/2">
          <Image
            src="/images/Financial data-amico.svg"
            alt="Financial data illustration"
            width={600}
            height={600}
            className="w-[300px] h-[300px] xl:w-[500px] xl:h-[500px]"
          />
        </div>
        <div className="flex flex-col px-3 xl:px-0 gap-3">
          <h3 className="text-2xl font-semibold text-default tracking-wide mb-4">
            Running your business shouldn&apos;t feel this chaotic.
          </h3>
          <h4 className="text-lg text-text-muted mb-3">
            You started to do what you love — create, teach, style, design,
            photograph, build. But somehow, your day ends buried in
            spreadsheets, messages, and overdue reminders.
          </h4>
          <ul className="flex flex-col gap-4 mx-auto mb-6 px-3 xl:px-0">
            <li className="text-money font-semibold flex gap-3 items-center">
              <Hourglass className="h-5 w-5 text-default" />
              <span className="flex-1">
                Switching between multiple tools just to stay on top of tasks.
              </span>
            </li>
            <li className="text-money font-semibold flex gap-3 items-center">
              <Calendar className="h-5 w-5 text-default" />
              <span className="flex-1">
                Appointments forgotten or double-booked.
              </span>
            </li>
            <li className="text-money font-semibold flex gap-3 items-center">
              <Mail className="h-5 w-5 text-default" />
              <span className="flex-1">
                Invoices delayed or lost in email threads.
              </span>
            </li>
            <li className="text-money font-semibold flex gap-3 items-center">
              <Settings className="h-5 w-5 text-default" />
              <span className="flex-1">
                Too much admin, not enough actual work.
              </span>
            </li>
          </ul>
          <p className="text-text-muted/80">
            That&apos;s why we built WorkHub — your all-in-one place to manage
            clients, bookings, and invoices with ease.
          </p>
        </div>
      </div>
    </section>
  );
}
