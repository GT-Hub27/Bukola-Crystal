# Supabase setup

The storefront can run its local preview without Supabase. Shared customer accounts, carts, saved inspiration, and orders require a Supabase project.

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `supabase/schema.sql`.
3. In `config.js`, set `supabase.url` to the project URL and `supabase.publishableKey` to the project's publishable key (or legacy anon key). These are browser-visible values; never put a `service_role` key in this site.
4. Enable email/password sign-in in Supabase Authentication and set the site's account page as the allowed redirect URL.
5. Register the atelier admin through the account page. Then grant that user admin access in the SQL Editor, replacing the example email:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where lower(email) = lower('admin@example.com')
   on conflict (user_id) do nothing;
   ```

6. Publish the site. Sign in to the studio dashboard with the admin's Supabase account and connect GitHub as usual. The admin dashboard syncs priced storefront products to Supabase before they can be ordered.

Unpriced designs stay inquiry-only until a price is set in the product editor. Existing browser-only preview accounts and saved inspiration remain local to the device and do not migrate into Supabase. Customers must create a Supabase account for cross-device order history.

Orders are submitted on the website; payment is recorded manually by the admin. The status flow is placed, received, payment confirmed, shipped, delivered, or cancelled.
