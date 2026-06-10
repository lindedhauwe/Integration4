import { supabase } from "~/supabase";

export async function clientLoader() {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*");

  if (error) throw new Error(error.message);

  return data;
}

