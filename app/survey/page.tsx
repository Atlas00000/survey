import { SurveyForm } from "@/components/survey-form"

export default function SurveyPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/images/background.png)" }}
    >
      <div className="min-h-screen bg-blue-900/90 backdrop-blur-sm">
        <div className="container mx-auto py-8 px-4">
          <header className="mb-8 text-center">
            <div className="inline-block p-2 bg-white rounded-xl shadow-sm mb-4">
              <div className="bg-blue-800 text-white px-4 py-2 rounded-lg">
                <h1 className="text-xl font-semibold tracking-tight">EMERGENCY RENTAL ASSISTANCE</h1>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Participant Information Form</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Please complete all fields accurately. Your information will be kept confidential and used only for the
              purposes specified in our privacy policy.
            </p>
          </header>

          <main className="max-w-4xl mx-auto pb-16">
            <SurveyForm />

            <footer className="mt-12 text-center text-sm text-blue-200">
              <p>© {new Date().getFullYear()} Emergency Rental Assistance Program. All rights reserved.</p>
              <p className="mt-1">For assistance, please contact support@erap.org</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}
