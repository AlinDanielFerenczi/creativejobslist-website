-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_logo" TEXT,
    "location" TEXT NOT NULL,
    "is_remote" BOOLEAN NOT NULL DEFAULT false,
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "salary_currency" TEXT DEFAULT 'USD',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);
