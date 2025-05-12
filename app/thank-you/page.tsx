"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft } from "lucide-react"

export default function ThankYouPage() {
  const [referenceNumber, setReferenceNumber] = useState<string>("")

  useEffect(() => {
    // Get the reference number from sessionStorage
    const storedReference = sessionStorage.getItem("applicationReference")
    if (storedReference) {
      setReferenceNumber(storedReference)
    } else {
      // Fallback if no reference number is found
      setReferenceNumber(
        `ERA-${Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0")}`,
      )
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: "url(/images/background.png)" }}
    >
      <div className="min-h-screen w-full bg-blue-900/90 backdrop-blur-sm flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8 md:p-12 text-center m-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Thank You!</h1>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8">
            <p className="text-xl text-slate-700">Your application has been successfully submitted.</p>
            <p className="text-slate-600 mt-2">
              Reference Number: <span className="font-mono font-medium">{referenceNumber}</span>
            </p>
          </div>

          <p className="text-slate-600 mb-8">
            We appreciate your application to the Emergency Rental Assistance Program. Your information will be
            reviewed, and you will be contacted within 5-7 business days regarding the status of your application.
            <br />
            <br />
            <strong>Important:</strong> An email confirmation has been sent to the address you provided.
          </p>

          <Link href="/">
            <Button className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto">
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Button>
          </Link>

          <footer className="mt-12 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Emergency Rental Assistance Program. All rights reserved.</p>
            <p className="mt-1">For assistance, please contact support@erap.org</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
