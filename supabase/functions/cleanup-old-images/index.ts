import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

serve(async (req) => {
  try {
    // We use the service role key to bypass RLS and delete storage objects
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: { persistSession: false },
      }
    );

    console.log("Starting cleanup of old tattoo images...");

    // 1. Find all images that are due for deletion
    // Assuming delete_at is the column that determines when it should be deleted
    const { data: expiredImages, error: fetchError } = await supabaseClient
      .from("generated_images")
      .select("id, storage_path")
      .lte("delete_at", new Date().toISOString());

    if (fetchError) {
      throw fetchError;
    }

    if (!expiredImages || expiredImages.length === 0) {
      console.log("No expired images found.");
      return new Response(JSON.stringify({ message: "No expired images to delete." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log(`Found ${expiredImages.length} images to delete.`);

    // 2. Extract paths and IDs
    const pathsToDelete = expiredImages.map((img) => img.storage_path).filter(Boolean);
    const idsToDelete = expiredImages.map((img) => img.id);

    // 3. Delete from Storage API first
    if (pathsToDelete.length > 0) {
      const { data: storageData, error: storageError } = await supabaseClient
        .storage
        .from("tattoo-images")
        .remove(pathsToDelete);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        throw storageError;
      }
      console.log("Successfully deleted from storage bucket:", storageData);
    }

    // 4. Delete the database rows
    if (idsToDelete.length > 0) {
      const { error: dbError } = await supabaseClient
        .from("generated_images")
        .delete()
        .in("id", idsToDelete);

      if (dbError) {
        console.error("Error deleting database rows:", dbError);
        throw dbError;
      }
      console.log("Successfully deleted database rows.");
    }

    return new Response(JSON.stringify({ 
      message: `Successfully deleted ${expiredImages.length} images.`,
      deletedCount: expiredImages.length
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Cleanup failed:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
