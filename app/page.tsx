import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Phone, FileText, HelpCircle, Clock, Mail, Home } from "lucide-react"

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/background.png)" }}
    >
      <div className="min-h-screen bg-blue-900/90 backdrop-blur-sm">
        <header className="border-b border-blue-700">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-white p-2 rounded-full mr-3">
                  <Home className="h-6 w-6 text-blue-800" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Emergency Rental Assistance</h1>
                  <p className="text-blue-200 text-sm">Keeping Families in their Homes</p>
                </div>
              </div>
              <nav>
                <ul className="flex space-x-6 text-blue-100">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#eligibility" className="hover:text-white transition-colors">
                      Eligibility
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Get Help With Your Rent and Utilities
                </h2>
                <p className="text-xl text-blue-100 mb-10">
                  The Emergency Rental Assistance Program provides financial support to eligible households unable to
                  pay rent or utilities due to the COVID-19 pandemic.
                </p>
                <Link href="/survey" className="inline-block">
                  <Button
                    size="lg"
                    className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 font-semibold"
                  >
                    Submit Application
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Info Cards */}
          <section className="py-12 bg-blue-800/50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <FileText className="h-7 w-7 text-blue-800" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Application Process</h3>
                  <p className="text-slate-600">
                    Complete the online application form with your personal information, income details, and required
                    documentation.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <Clock className="h-7 w-7 text-blue-800" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Processing Time</h3>
                  <p className="text-slate-600">
                    Applications are typically processed within 5-7 business days. You will be notified of your status
                    via email.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <HelpCircle className="h-7 w-7 text-blue-800" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Need Help?</h3>
                  <p className="text-slate-600">
                    Our support team is available Monday through Friday, 9am to 5pm to assist with your application.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Eligibility Section */}
          <section id="eligibility" className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Eligibility Requirements</h2>
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                        <ChevronRight className="h-4 w-4 text-blue-800" />
                      </div>
                      <p className="text-slate-700">Household income at or below 80% of the area median income</p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                        <ChevronRight className="h-4 w-4 text-blue-800" />
                      </div>
                      <p className="text-slate-700">
                        One or more individuals in the household has qualified for unemployment benefits or experienced
                        a reduction in household income due to COVID-19
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                        <ChevronRight className="h-4 w-4 text-blue-800" />
                      </div>
                      <p className="text-slate-700">
                        One or more individuals in the household can demonstrate a risk of experiencing homelessness or
                        housing instability
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                        <ChevronRight className="h-4 w-4 text-blue-800" />
                      </div>
                      <p className="text-slate-700">
                        The household is a rental household (homeowners with mortgages are not eligible)
                      </p>
                    </li>
                  </ul>
                  <div className="mt-8 text-center">
                    <Link href="/survey">
                      <Button className="bg-blue-800 hover:bg-blue-700 text-white transition-all duration-300 transform hover:-translate-y-1">
                        Check Your Eligibility
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-16 bg-blue-800/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-8">Contact Us</h2>
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                    <div className="text-center md:text-left">
                      <div className="flex justify-center md:justify-start items-center mb-4">
                        <Phone className="h-6 w-6 text-blue-800 mr-2" />
                        <h3 className="text-xl font-bold text-blue-800">Phone Support</h3>
                      </div>
                      <p className="text-slate-700 mb-2">Call our support line:</p>
                      <p className="text-blue-800 font-bold text-xl">1-800-555-RENT</p>
                      <p className="text-slate-500 text-sm mt-1">Monday - Friday, 9am - 5pm</p>
                    </div>
                    <div className="h-px w-full md:h-32 md:w-px bg-slate-200"></div>
                    <div className="text-center md:text-left">
                      <div className="flex justify-center md:justify-start items-center mb-4">
                        <Mail className="h-6 w-6 text-blue-800 mr-2" />
                        <h3 className="text-xl font-bold text-blue-800">Email Support</h3>
                      </div>
                      <p className="text-slate-700 mb-2">Send us an email:</p>
                      <p className="text-blue-800 font-bold">support@erap.org</p>
                      <p className="text-slate-500 text-sm mt-1">We respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-blue-950 text-blue-200 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p>© {new Date().getFullYear()} Emergency Rental Assistance Program</p>
                <p className="text-sm text-blue-400">A federal government program</p>
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-blue-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
