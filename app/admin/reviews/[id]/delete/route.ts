import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;

  const supabase = await createClient();

  // Check that the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Delete ratings
  const { error: ratingsError } = await supabase
    .from("ratings")
    .delete()
    .eq("visit_id", id);

  if (ratingsError) {
    console.error("DELETE RATINGS ERROR:", ratingsError);

    return NextResponse.redirect(
      new URL("/admin/reviews?error=ratings", request.url),
    );
  }

  // Delete vegetables
  const { error: vegetablesError } = await supabase
    .from("visit_vegetables")
    .delete()
    .eq("visit_id", id);

  if (vegetablesError) {
    console.error("DELETE VEGETABLES ERROR:", vegetablesError);

    return NextResponse.redirect(
      new URL("/admin/reviews?error=vegetables", request.url),
    );
  }

  // Delete sides
  const { error: sidesError } = await supabase
    .from("visit_sides")
    .delete()
    .eq("visit_id", id);

  if (sidesError) {
    console.error("DELETE SIDES ERROR:", sidesError);

    return NextResponse.redirect(
      new URL("/admin/reviews?error=sides", request.url),
    );
  }

  // Finally delete the visit
  const { error: visitError } = await supabase
    .from("visits")
    .delete()
    .eq("id", id);

  if (visitError) {
    console.error("DELETE VISIT ERROR:", visitError);

    return NextResponse.redirect(
      new URL("/admin/reviews?error=visit", request.url),
    );
  }

  return NextResponse.redirect(
    new URL("/admin/reviews?deleted=true", request.url),
  );
}
