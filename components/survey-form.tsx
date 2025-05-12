"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ClipboardList,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Users,
  DollarSign,
  Upload,
  ChevronRight,
  Shield,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Define a schema that accepts any input without validation
const fileSchema = z.any()

const formSchema = z.object({
  name: z.any(),
  email: z.any(),
  gender: z.any(),
  phoneNumber: z.any(),
  birthCity: z.any(),
  ssn: z.any(),
  motherFullName: z.any(),
  fatherFullName: z.any(),
  motherMaidenName: z.any(),
  pastDueAmount: z.any(),
  evicted: z.any(),
  appliedBefore: z.any(),
  socialSecurity: z.any(),
  idVerified: z.any(),
  driverLicenseFront: fileSchema,
  driverLicenseBack: fileSchema,
})

export function SurveyForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      birthCity: "",
      ssn: "",
      motherFullName: "",
      fatherFullName: "",
      motherMaidenName: "",
      pastDueAmount: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Clean up file data for JSON serialization
      const cleanedData = { ...values }
      if (cleanedData.driverLicenseFront) {
        cleanedData.driverLicenseFront = "File uploaded"
      }
      if (cleanedData.driverLicenseBack) {
        cleanedData.driverLicenseBack = "File uploaded"
      }

      // Send the data directly to the API route
      const response = await fetch('/api/send-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit application")
      }

      const result = await response.json()

      if (result.success) {
        // Store the reference number in sessionStorage to display on thank you page
        if (result.referenceNumber) {
          sessionStorage.setItem("applicationReference", result.referenceNumber)
        }
        router.push("/thank-you")
      } else {
        setError("Failed to submit application. Please try again.")
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again later.")
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-blue-200 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>
            <p className="text-blue-100 text-sm mt-1">Please provide your basic personal details</p>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Enter your full name"
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Identification Information</h2>
            </div>
            <p className="text-blue-100 text-sm mt-1">Please provide your identification details</p>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="birthCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">City of Birth</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Enter your city of birth"
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Social Security Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="XXX-XX-XXXX"
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-slate-500">Format: XXX-XX-XXXX or XXXXXXXXX</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Family Information</h2>
            </div>
            <p className="text-blue-100 text-sm mt-1">Please provide information about your family</p>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="motherFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Mother's Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Enter your mother's full name"
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fatherFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Father's Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Enter your father's full name"
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motherMaidenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Mother's Maiden Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Enter your mother's maiden name"
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pastDueAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Past Due Rent/Utilities</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Status Questions</h2>
            </div>
            <p className="text-blue-100 text-sm mt-1">
              Please answer the following questions about your current status
            </p>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <FormField
                  control={form.control}
                  name="evicted"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-slate-700 font-medium">Have you been evicted?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <FormField
                  control={form.control}
                  name="appliedBefore"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-slate-700 font-medium">Have you applied before?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <FormField
                  control={form.control}
                  name="socialSecurity"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-slate-700 font-medium">
                        Are you currently receiving Social Security payments?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <FormField
                  control={form.control}
                  name="idVerified"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-slate-700 font-medium">Have you been verified by IDME?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-700 text-white py-4">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Document Upload</h2>
            </div>
            <p className="text-blue-100 text-sm mt-1">Please upload the required documentation</p>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="driverLicenseFront"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Driver's License (Front)</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                        <p className="text-sm text-slate-600 mb-2">Drag and drop your image here, or click to browse</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files)}
                          className="border-none p-0 mx-auto max-w-xs"
                          {...fieldProps}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-slate-500 text-center mt-2">
                      Upload a clear image of the front of your driver's license
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverLicenseBack"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Driver's License (Back)</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                        <p className="text-sm text-slate-600 mb-2">Drag and drop your image here, or click to browse</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files)}
                          className="border-none p-0 mx-auto max-w-xs"
                          {...fieldProps}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-slate-500 text-center mt-2">
                      Upload a clear image of the back of your driver's license
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        <div className="text-center mt-4 text-sm text-blue-100">
          By submitting this form, you agree to our{" "}
          <a href="#" className="underline hover:text-white">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-white">
            Privacy Policy
          </a>
        </div>
      </form>
    </Form>
  )
}
