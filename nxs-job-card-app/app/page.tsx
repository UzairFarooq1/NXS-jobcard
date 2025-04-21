import JobCardForm from "@/components/job-card-form"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Field Engineer Job Card</h1>
      <JobCardForm />
    </main>
  )
}
