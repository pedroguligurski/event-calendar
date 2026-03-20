-- CreateEnum
CREATE TYPE "event_status_enum" AS ENUM ('draft', 'published', 'canceled');

-- AlterTable
ALTER TABLE "events"
ADD COLUMN "status" "event_status_enum" NOT NULL DEFAULT 'draft';
