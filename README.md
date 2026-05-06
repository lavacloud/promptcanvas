# PromptCanvas — Deploy Guide

## What you need
- [Vercel](https://vercel.com) account (free)
- [Supabase](https://supabase.com) account (free)
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

---

## Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Once created, go to **SQL Editor** and paste + run the contents of `supabase-schema.sql`
3. Go to **Project Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public key** (long string starting with `eyJ...`)
4. Go to **Authentication → Providers** — Email is enabled by default ✓

---

## Step 2 — Deploy to Vercel

1. Push this folder to a GitHub repo (or use Vercel CLI: `npx vercel`)
2. In Vercel → New Project → import your repo
3. Go to **Settings → Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` |
   | `SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `SUPABASE_ANON_KEY` | `eyJ...` |

4. Click **Deploy** — you're live!

---

## How it works

- Users sign up / log in with email + password
- Each user's chats are stored in Supabase, isolated by their user ID
- Supabase Row Level Security ensures nobody can read anyone else's chats
- The Anthropic API key never touches the browser — all AI calls go through `/api/chat`
