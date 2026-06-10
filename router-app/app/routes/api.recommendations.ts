import { supabase } from "~/supabase.server";
import { json } from "@react-router/server";
import { Form, Link , useLoaderData, useActionData } from "react-router";

export async function loader() {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*");

  if (error) throw new Error(error.message);

  return json(data);
}
