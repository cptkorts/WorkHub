import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-semibold font-lato text-gray-900 mb-4">
            Welcome to <span className="font-molgan font-bold">WorkHub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your clients, appointments, and invoices — all in one place.
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Perfect for freelancers, photographers, barbers, designers, tutors,
            and small service providers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📇</div>
            <h3 className="text-xl font-semibold mb-2">Client Management</h3>
            <p className="text-gray-600">
              Keep track of all your clients with detailed profiles, contact
              info, and service history.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">
              Appointment Scheduling
            </h3>
            <p className="text-gray-600">
              Schedule and manage appointments with an intuitive calendar view.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Invoices & Payments</h3>
            <p className="text-gray-600">
              Generate professional invoices and track your income with payment
              analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
