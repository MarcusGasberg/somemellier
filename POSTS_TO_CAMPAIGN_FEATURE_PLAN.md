# Feature Plan: Adding Posts to Campaigns

## Overview
Implement the ability for users to create posts and assign them to specific campaigns. This feature will include a post creation modal, campaign-aware post filtering, and integration with the existing dashboard timeline.

## Current State Analysis
- **Posts Schema**: Posts have an optional `campaignId` field referencing campaigns
- **Dashboard Filtering**: Posts are filtered by current campaign client-side via `usePosts` hook
- **Post Creation**: No manual post creation UI exists - only AI generation (which doesn't save to DB)
- **API**: Posts endpoint gets all user posts, filtering happens client-side
- **UI**: "New Post" button and timeline Plus buttons are non-functional

## Implementation Plan

### 1. Update Posts API (High Priority)
- Modify `/api/posts` GET handler to accept optional `campaignId` query parameter
- Filter posts server-side by campaign when parameter is provided
- This improves performance and ensures consistency

### 2. Create Post Creation Modal (High Priority)
- Build `PostCreationModal` component using TanStack Form with fields:
  - Content textarea (required, max 280 chars)
  - Channel selection dropdown (from user's connected channels via TanStack DB)
  - Post type selection (dropdown with options: "thought-leadership", "educational", "lifestyle", "promotional")
  - Schedule date/time picker (optional, defaults to draft)
  - Campaign context display (read-only)
- Use TanStack DB for channel data fetching
- Include pre-filling for timeline slot clicks

### 3. Connect Dashboard Buttons (Medium Priority)
- Wire up the "New Post" button in dashboard header to open the modal
- Wire up Plus buttons in timeline slots to open modal with:
  - Pre-selected channel (based on the column)
  - Pre-selected date (based on the slot)
  - Current campaign context

### 4. Campaign Assignment Logic (High Priority)
- Ensure all new posts include the current campaign ID from dashboard state
- Update post creation API to validate campaign ownership
- Handle case where no campaign is selected (shouldn't happen in normal flow)

### 5. AI Generation Integration (Medium Priority)
- Modify `handleAiGeneration` in dashboard to actually create posts in database
- Assign generated posts to current campaign
- Set appropriate post types and channels based on AI output

## Technical Implementation Details

### PostCreationModal Component
```typescript
interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: NewPost) => void;
  prefillData?: {
    channelId?: string;
    scheduledAt?: Date;
  };
  currentCampaign: Campaign;
}

const formSchema = z.object({
  content: z.string().min(1, "Content is required").max(280, "Content too long"),
  channelId: z.string().min(1, "Channel selection is required"),
  postType: z.enum(["thought-leadership", "educational", "lifestyle", "promotional"]),
  scheduledAt: z.date().optional(),
});
```

### API Changes
- `GET /api/posts?campaignId=<id>` - Filter posts by campaign server-side
- `POST /api/posts` - Create post with campaign assignment

### File Changes Required
- `src/routes/api/posts.ts` - Add campaign filtering
- `src/components/post-creation-modal.tsx` - New component
- `src/components/dashboard.tsx` - Connect buttons and modal
- `src/components/ai-panel.tsx` - Update generation handler

### Testing Considerations
- Test post creation with different campaigns
- Verify campaign filtering works correctly
- Test timeline slot pre-filling
- Ensure proper error handling for invalid campaigns/channels

## Benefits
- **Campaign Organization**: Users can organize posts by campaign
- **Improved UX**: Intuitive post creation with pre-filling
- **Performance**: Server-side filtering reduces client load
- **Consistency**: Uses existing TanStack Form/DB patterns
- **Real-time Updates**: Automatic timeline updates via TanStack DB

## Implementation Order
1. Update posts API for campaign filtering
2. Create PostCreationModal component
3. Connect dashboard buttons
4. Implement campaign assignment logic
5. Update AI generation integration

This plan ensures posts are properly associated with campaigns while maintaining the existing dashboard workflow and adding the missing post creation functionality.