import { createClient } from '@/lib/supabase/server'
import ReviewForm from '@/components/admin/ReviewForm'

export default async function NewReviewPage() {
  const supabase = await createClient()

  const {
  data: { user },
} = await supabase.auth.getUser()

console.log("CURRENT USER:", user)

  const { data: shops, error } = await supabase
    .from('shops')
    .select('id, name, city, state')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error(error)

    return (
      <main className="p-8">
        <h1>Unable to load shops</h1>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold">
        Add Review
      </h1>

      <p className="mb-8 text-gray-500">
        Add your latest ayam gepuk experience.
      </p>

      <ReviewForm shops={shops ?? []} />
    </main>
  )
}