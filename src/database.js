const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   console.warn(
//     "Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env",
//   );
// }

const supabase = createClient(
  "https://wgaiwjkqznrnthemdaqw.supabase.co",
  "sb_publishable_8bvcqU_FFq95ajcZx22WpQ_LmZPPb0r",
);

module.exports = supabase;
