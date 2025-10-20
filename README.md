# Veriton Genesis - AI Orchestra Platform

**Private Repository:** https://github.com/buge4/veriton-genesis

## What This Is

Veriton Genesis is an enterprise-grade multi-AI orchestration system featuring:

- **AI Orchestra:** Multi-model AI coordination (OpenAI, Claude, Gemini, Minimax)
- **Business Hub:** Investor dashboard, analytics, documents, and timeline
- **AI Admin Panel:** Natural language website management
- **Authentication:** Role-based access control with Supabase
- **Real-time Data:** Supabase backend with live subscriptions

## Current Status

✅ **Latest Test Deployment:** https://zut5tan8lajj.space.minimax.io

### Active Features:
- Homepage with TVRF marketing content (PUBLIC)
- Business Hub with 4 sub-pages (PUBLIC)
- Veriton Genesis AI Orchestra (LOGIN REQUIRED)
- AI Admin Panel (LOGIN REQUIRED)
- User authentication system

### User Accounts:
1. **bvhauge@gmail.com** (Password: Trysil416!)
   - Role: ADMIN
   - Access: All pages including Veriton Genesis & AI Admin

2. **magnus.godiksen@gmail.com** (Password: KappaHa4!)
   - Role: basic_user
   - Access: Public pages only

## Backend (Supabase)

**Project:** xprtzodwutgskpdvyxwn
**URL:** https://xprtzodwutgskpdvyxwn.supabase.co

### Database Tables:
- `website_sections` - Homepage content structure
- `content_blocks` - Detailed section content
- `business_hub_timeline_events` - Development timeline
- `business_hub_articles` - Article content
- `business_hub_dashboard_content` - Dashboard metrics
- `page_blocks` - Document page blocks
- `kingmaker_agents` - AI service status
- `kingmaker_projects` - Project management
- `kingmaker_conversations` - Chat history
- `kingmaker_usage_logs` - AI usage tracking
- `user_roles` - Authentication and access control

### Edge Functions:
- `execute-openai` - GPT-4 integration
- `execute-claude` - Claude integration
- `execute-gemini` - Gemini integration
- `orchestrate-task` - Multi-AI coordinator
- `create-project` - Project initialization
- `get-analytics` - Usage analytics

## Technology Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Database + Auth + Edge Functions)
- **Deployment:** Vercel (optimized for React)
- **Version Control:** GitHub (private repository)

## Next Steps

See **VERCEL_DEPLOYMENT_GUIDE.md** for instructions on deploying to veriton.io

## Architecture

```
GitHub (veriton-genesis) → Vercel → veriton.io
                            ↓
                         Supabase Backend
```

**Automatic Deployments:** Every push to the main branch automatically deploys to veriton.io through Vercel.

## Support

For issues or changes, contact the development team or update the code and push to GitHub - it will auto-deploy.
