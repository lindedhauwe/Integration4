import { supabase } from "../supabase";

export async function clientLoader({ request }) {
    const url = new URL(request.url);
    const cafeId = url.searchParams.get("cafe_id");
    if (!cafeId) return { recs: [] };
    const { data } = await supabase
        .from("recommendations")
        .select("*")
        .eq("cafe_id", cafeId)
        .limit(5);
    return { recs: data || [] };
}
