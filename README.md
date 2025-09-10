# Pinstack

Pinterest alternative for developers/designers.

 
## Quick Start

```bash
git clone https://github.com/vvc10/pinstack.git
cd pinstack
pnpm install
cp env.local.template .env.local
# Edit .env.local with your Supabase credentials
pnpm dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```
 
 