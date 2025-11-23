-- First add the column as nullable
ALTER TABLE "user_channels" ADD COLUMN "icon_key" text;

-- Populate the icon_key from the channels table
UPDATE "user_channels"
SET "icon_key" = "channels"."icon_key"
FROM "channels"
WHERE "user_channels"."channel_id" = "channels"."id";

-- Make the column NOT NULL
ALTER TABLE "user_channels" ALTER COLUMN "icon_key" SET NOT NULL;