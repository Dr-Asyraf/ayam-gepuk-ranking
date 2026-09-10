import { createClient } from '@/lib/supabase/client'

export default async function Home() {
  const supabase = createClient()

  const { data: shops, error } = await supabase
    .from('shops')
    .select('*')

  if (error) {
    console.error(error)
    return <div>Failed to load shops</div>
  }

  return (
    <main>
      <h1>Ayam Gepuk Rankings</h1>

      {shops?.map((shop) => (
        <div key={shop.id}>
          <h2>{shop.name}</h2>
          <p>{shop.city}, {shop.state}</p>
        </div>
      ))}
    </main>
  )
}