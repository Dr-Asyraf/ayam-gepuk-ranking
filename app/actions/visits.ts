'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const reviewSchema = z.object({
  shopId: z.string().uuid(),
  visitedAt: z.string().min(1),

  chicken: z.number().min(0).max(10),
  sambalKacang: z.number().min(0).max(10),
  sayur: z.number().min(0).max(10),
  sides: z.number().min(0).max(10),

  vegetables: z.array(
    z.enum([
      'Kubis',
      'Kangkung',
      'Bayam Goreng',
    ])
  ),

  sidesAvailable: z.array(
    z.enum([
      'Tempe',
      'Tauhu',
      'Telur',
      'Pedal',
      'Enoki / Mushroom Goreng',
    ])
  ),

  comments: z.string().optional(),
})

export async function createReview(
  data: z.infer<typeof reviewSchema>
) {
  const validation = reviewSchema.safeParse(data)

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid review data.',
    }
  }

  const supabase = await createClient()

  /*
   * 1. Create visit
   */

  const { data: visit, error: visitError } =
    await supabase
      .from('visits')
      .insert({
        shop_id: data.shopId,
        visited_at: data.visitedAt,
        comments: data.comments ?? null,
      })
      .select('id')
      .single()

  if (visitError) {
    console.error(visitError)

    return {
      success: false,
      error: 'Failed to create visit.',
    }
  }

  /*
   * 2. Create rating
   */

  const { error: ratingError } = await supabase
    .from('ratings')
    .insert({
      visit_id: visit.id,
      chicken: data.chicken,
      sambal_kacang: data.sambalKacang,
      sayur: data.sayur,
      sides: data.sides,
    })

  if (ratingError) {
    console.error(ratingError)

    return {
      success: false,
      error: 'Failed to create rating.',
    }
  }

  /*
   * 3. Save vegetables
   */

  if (data.vegetables.length > 0) {
    const vegetableRows = data.vegetables.map(
      (vegetable) => ({
        visit_id: visit.id,
        vegetable,
      })
    )

    const { error } = await supabase
      .from('visit_vegetables')
      .insert(vegetableRows)

    if (error) {
      console.error(error)

      return {
        success: false,
        error: 'Failed to save vegetables.',
      }
    }
  }

  /*
   * 4. Save sides
   */

  if (data.sidesAvailable.length > 0) {
    const sideRows = data.sidesAvailable.map(
      (side) => ({
        visit_id: visit.id,
        side,
      })
    )

    const { error } = await supabase
      .from('visit_sides')
      .insert(sideRows)

    if (error) {
      console.error(error)

      return {
        success: false,
        error: 'Failed to save sides.',
      }
    }
  }

  return {
    success: true,
  }
}