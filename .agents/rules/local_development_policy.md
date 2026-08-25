# Workspace Rule: Local Development Policy

1. **NO GIT PUSH TO GITHUB:**
   - Never run `git push` or push commits to GitHub unless the user explicitly orders a git push.
   - All work must stay local on the developer's machine and be verified on `http://localhost:4321`.

2. **NO DUMMY / MOCK DATA:**
   - Remove dummy mock data fallbacks from `queries.ts` and `mock-data.ts`.
   - Applications must query real database tables and handle empty states (`[]`) cleanly in the UI.
