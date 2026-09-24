"use server";

import { createClient } from "@/lib/supabase/server";

export async function deactivateShop(shopId: string) {
  const supabase = await createClient();

  // Make sure the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  // Deactivate the shop
  const { error } = await supabase
    .from("shops")
    .update({
      is_active: false,
    })
    .eq("id", shopId);

  if (error) {
    console.error("DEACTIVATE SHOP ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

export async function activateShop(shopId: string) {
  const supabase = await createClient();

  // Make sure the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in.",
    };
  }

  // Activate the shop
  const { error } = await supabase
    .from("shops")
    .update({
      is_active: true,
    })
    .eq("id", shopId);

  if (error) {
    console.error("ACTIVATE SHOP ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}