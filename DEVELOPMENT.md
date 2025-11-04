# QuestLog Development Guide

## 🚀 Performance Optimizations

This app includes several performance optimizations:

### React.memo Components
- `OptimizedDashboard` - Prevents unnecessary dashboard rerenders
- `OptimizedQuestCard` - Memoized quest cards for efficient list rendering
- `StatCard` - Memoized stat cards
- `RecentQuestCard` - Memoized recent quest items

### Database Indexes
All queries are optimized with proper indexes:
- User-specific quest queries
- Quest history lookups
- Skill category searches
- Equipped items filtering

### Custom Hooks
- `useQuestOperations` - Encapsulates all quest CRUD operations
- `useRewardOperations` - Manages reward and item operations
- Separation of concerns for better code organization

## 🎨 Design System

All colors use semantic tokens from `src/index.css`:
- `--primary` - Main brand color (purple)
- `--secondary` / `--gold` - Gold accent
- `--accent` - Success green
- `--destructive` - Alert red
- `--leisure` - Pink for leisure activities
- `--insight` - Cyan for insights

**Never use direct colors** - always use design system tokens!

## 📱 Mobile Optimizations

- Touch targets minimum 44px (iOS guidelines)
- Safe area insets for notched devices
- Bottom navigation for mobile
- Responsive text sizes
- Touch-friendly buttons

## 🤖 AI Integration

The AI Coach uses Lovable AI Gateway with:
- Streaming responses for real-time feedback
- Tool calling for structured outputs (quest suggestions, breakdowns)
- Context-aware prompts based on player stats
- Conversation history persistence

### Edge Function: `ai-coach-chat`
- Handles all AI requests
- Streams responses token-by-token
- Proper error handling for rate limits (429) and credits (402)

## 🔒 Security

- Row Level Security (RLS) on all tables
- User-specific data isolation
- Proper authentication checks
- Safe database queries

## 🛠️ Development Tips

### Adding New Features
1. Create focused components in `src/components/`
2. Use custom hooks for data operations
3. Add to design system if new colors needed
4. Test on mobile viewport

### Database Changes
1. Use `supabase--migration` tool
2. Always add RLS policies
3. Consider adding indexes for performance
4. Test with real user data

### Performance Monitoring
Use the performance utils in `src/utils/performance.ts`:
```typescript
import { measurePerformance } from '@/utils/performance';

const data = await measurePerformance('Load Quests', async () => {
  return await supabase.from('quests').select('*');
});
```

## 📦 Key Dependencies

- **React 18** - UI framework
- **Supabase** - Backend and database
- **Framer Motion** - Animations
- **TanStack Query** - Data fetching
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## 🎯 Best Practices

1. **Code Organization**
   - Small, focused components
   - Custom hooks for business logic
   - Separate concerns (UI vs logic)

2. **Performance**
   - Use React.memo for expensive components
   - Batch state updates
   - Lazy load heavy components
   - Optimize database queries

3. **UX**
   - Loading states for async operations
   - Error boundaries for graceful failures
   - Toast notifications for feedback
   - Skeleton loaders during data fetch

4. **Accessibility**
   - ARIA labels on interactive elements
   - Keyboard navigation support
   - Touch-friendly targets
   - Proper semantic HTML

## 🐛 Debugging

### Common Issues

**Quest not completing:**
- Check console for errors
- Verify RLS policies
- Check user authentication

**Slow performance:**
- Check for missing indexes
- Look for unnecessary rerenders
- Profile with React DevTools

**AI Coach not responding:**
- Check LOVABLE_API_KEY is set
- Verify edge function is deployed
- Check for rate limiting (429 errors)

### Useful Commands

```bash
# View console logs
# Available in browser DevTools

# Check database
# Use Lovable Cloud UI to view tables

# Test edge functions
# Use the edge function testing tool in Lovable
```

## 🚢 Deployment

The app auto-deploys via Lovable Cloud:
- Frontend: Automatic deployment on save
- Edge Functions: Auto-deployed with code changes
- Database: Migrations run automatically

## 📈 Future Improvements

Potential enhancements to consider:
- Real-time collaboration
- Social features (friends, leaderboards)
- Advanced analytics dashboard
- Push notifications
- Dark/light theme toggle
- Export to calendar apps
- Webhook integrations
- Mobile native app (Capacitor)

---

Built with ❤️ using Lovable
