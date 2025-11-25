# Campaign Feature Implementation Plan

## Overview
Implement a campaign management system that allows users to organize their social media posts into campaigns. Users can create multiple campaigns, switch between them, and have a default "Default" campaign created automatically for new users.

## Current State Analysis
- Dashboard shows static campaign chip "Q4 Growth Push" in header
- Posts are tied directly to users and channels, no campaign scoping
- Uses TanStack React-DB for data management (following use-user-channels.ts pattern)
- Database: users, channels, userChannels, posts tables

## Implementation Plan

### Phase 1: Database Schema (High Priority)
1. **Create campaigns table** (`src/db/schema/campaigns-schema.ts`):
   - `id` (text, primary key)
   - `userId` (text, foreign key to user.id)
   - `name` (text, not null)
   - `description` (text, optional)
   - `isDefault` (boolean, default false)
   - `createdAt`/`updatedAt` timestamps

2. **Update posts table** to include `campaignId` foreign key referencing campaigns.id

### Phase 2: API Layer (High Priority)
3. **Campaign CRUD endpoints** (`src/routes/api/campaigns.ts`):
   - `GET /api/campaigns` - List user's campaigns
   - `POST /api/campaigns` - Create new campaign
   - `PUT /api/campaigns/:id` - Update campaign
   - `DELETE /api/campaigns/:id` - Delete campaign (with post reassignment logic)

### Phase 3: Data Management (Medium Priority)
4. **Campaign hooks** (`src/hooks/use-campaigns.ts`):
   - `campaignCollection` using `createCollection` with `queryCollectionOptions`
   - `queryFn` fetching from `/api/campaigns`
   - `onInsert` handler for mutations
   - `useCampaigns()` using `useLiveQuery`
   - `useCurrentCampaign()` for active campaign state management

### Phase 4: UI Components (Medium Priority)
5. **Campaign Selector Modal** (`src/components/campaign-selector-modal.tsx`):
   - List all user campaigns
   - "Create New Campaign" option
   - Search/filter functionality
   - Set active campaign

6. **Update Dashboard Header**:
   - Make campaign chip clickable (currently static "Q4 Growth Push")
   - Show current campaign name dynamically
   - Open campaign selector on click

### Phase 5: User Experience (Medium Priority)
7. **Default Campaign Creation**:
   - Auto-create "Default" campaign for new users
   - Set as default and active campaign
   - Trigger during user registration flow

8. **Posts Filtering**:
   - Update dashboard timeline to show only current campaign's posts
   - Modify `usePosts` hook to accept campaignId parameter
   - Update post creation to associate with current campaign

### Phase 6: Enhanced Features (Low Priority)
9. **Campaign Management Page** (future enhancement):
   - Dedicated page for campaign CRUD operations
   - Campaign analytics/metrics
   - Bulk post operations per campaign

10. **Internationalization**:
    - Add campaign-related strings to `public/locales/*/dashboard.json`
    - Support for campaign creation, selection, and management text

## Technical Details

### Data State Pattern (Following use-user-channels.ts)
```typescript
export const campaignCollection = createCollection(
  queryCollectionOptions({
    schema: campaignsSelectSchema,
    queryKey: ["campaigns"],
    queryFn: async () => { /* fetch from /api/campaigns */ },
    queryClient,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => { /* handle mutations */ },
  }),
);

export const useCampaigns = () => {
  return useLiveQuery((q) => q.from({ collection: campaignCollection }));
};
```

### Database Migration Strategy
- Create campaigns table
- Add campaignId column to posts (nullable initially)
- Create default "Default" campaign for existing users
- Assign existing posts to default campaigns
- Make campaignId non-nullable

### Key Considerations
- **Data Migration**: Existing posts need campaignId assignment
- **State Management**: Current campaign should persist across sessions
- **Performance**: Campaign filtering should be efficient
- **Validation**: Prevent deletion of campaigns with active posts
- **UX**: Seamless campaign switching without data loss

## Implementation Status
✅ **Phase 1 (Database & API)**: COMPLETED
- Created campaigns database schema with proper relationships
- Implemented CRUD API endpoints for campaigns
- Generated and applied database migrations

✅ **Phase 2 (UI & Core Functionality)**: COMPLETED
- Created campaign selector modal with create/select functionality
- Made dashboard campaign chip clickable and dynamic
- Implemented default "Default" campaign creation for new users
- Updated posts filtering to show only current campaign posts

✅ **Phase 3 (Polish & Translations)**: COMPLETED
- Added internationalization support for campaign strings
- Regenerated TypeScript types for translations
- Integrated campaign selection with dashboard state

## Implementation Order
**Phase 1**: Schema → API → Hooks ✅
**Phase 2**: Modal → Dashboard updates → Default campaign ✅
**Phase 3**: Settings page → Advanced features (Future)

## Success Criteria ✅
- ✅ Users can create and switch between campaigns
- ✅ New users get "Default" campaign automatically
- ✅ Dashboard shows posts only from current campaign
- ✅ Campaign chip is clickable and functional
- ✅ Data integrity maintained across campaign switches

## Files Created/Modified
### New Files:
- `src/db/schema/campaigns-schema.ts` - Campaign database schema
- `src/routes/api/campaigns.ts` - Campaign API endpoints
- `src/hooks/use-campaigns.ts` - Campaign data management hooks
- `src/components/campaign-selector-modal.tsx` - Campaign selection UI

### Modified Files:
- `src/db/schema.ts` - Added campaigns schema
- `src/db/schema/posts-schema.ts` - Added campaignId foreign key
- `src/components/dashboard.tsx` - Added campaign selection functionality
- `src/hooks/use-posts.ts` - Added campaign filtering
- `public/locales/en/dashboard.json` - Added campaign translations
- `src/@types/resources.d.ts` - Regenerated with new translations

## Database Changes
- Added `campaigns` table with user relationships
- Added `campaignId` column to `posts` table
- Applied migrations successfully

## Key Features Implemented
1. **Campaign Management**: Create, select, and switch between campaigns
2. **Default Campaign**: Automatic "Default" campaign for new users
3. **Post Filtering**: Dashboard shows only posts from selected campaign
4. **UI Integration**: Clickable campaign chip in dashboard header
5. **Internationalization**: Full i18n support for campaign features