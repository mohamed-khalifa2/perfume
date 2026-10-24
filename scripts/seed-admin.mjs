import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://azyxjsttupffdgmgyvbn.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === "placeholder-service-role-key") {
  console.error(
    "SUPABASE_SERVICE_ROLE_KEY is missing or placeholder. Set it in .env.local to seed the admin user.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const email = "mohamed.khalifa4090@gmail.com";
  const password = "khalifa500";

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) {
    console.error("Failed to list users:", listError.message);
    process.exit(1);
  }

  let userId = listData.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())?.id;

  if (!userId) {
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      console.error("Failed to create user:", createError.message);
      process.exit(1);
    }

    userId = createData.user.id;
    console.log("Created auth user:", userId);
  } else {
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });

    if (updateError) {
      console.error("Failed to update user:", updateError.message);
      process.exit(1);
    }

    console.log("Updated existing auth user:", userId);
  }

  const { error: adminError } = await supabase.from("admins").upsert({ user_id: userId }, { onConflict: "user_id" });
  if (adminError) {
    console.error("Failed to upsert admin record:", adminError.message);
    process.exit(1);
  }

  console.log("Admin seeded successfully:", email);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
