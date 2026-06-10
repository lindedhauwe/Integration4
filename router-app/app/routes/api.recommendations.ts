//import { json } from "react-router";
import { supabase } from "~/supabase.server";

export async function loader() {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*");

  if (error) {
    throw new Error(error.message);
    //return json({ error: error.message }, { status: 500 });
  }

  return data;
}

