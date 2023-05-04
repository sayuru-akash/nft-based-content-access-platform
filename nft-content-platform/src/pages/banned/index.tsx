import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export default function BannedLanding() {
  return (
    <>
      <Navbar />
      <div className="bg-purple-50">
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ExclamationCircleIcon className="h-20 w-20 text-red-600 mx-auto" />
              <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
                User Banned!
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Your wallet has been banned due to violation of our terms and
                conditions. Please contact support if you believe this is a
                mistake.
              </p>
              <p className="mt-2 text-lg text-pink-600">
                If you are a new user, please try connecting to a new wallet and
                visiting another page.
              </p>

              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="mailto:support@example.com"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <EnvelopeIcon
                      className="-ml-1 mr-3 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Email Support</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
