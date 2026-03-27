import prisma from '../../utils/prisma'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'You must be logged in to post a job' })
    }

    const body = await readBody(event)

    if (!body.title || !body.companyName || !body.location || !body.description) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields: title, companyName, location, description' })
    }

    try {
        const job = await prisma.job.create({
            data: {
                title: body.title,
                companyName: body.companyName,
                location: body.location,
                isRemote: body.isRemote ?? false,
                salaryMin: body.salaryMin ? parseInt(body.salaryMin) : null,
                salaryMax: body.salaryMax ? parseInt(body.salaryMax) : null,
                salaryCurrency: body.salaryCurrency ?? 'USD',
                tags: body.tags ?? [],
                description: body.description,
                status: 'pending_payment',
                userId: user.id
            }
        })

        return { id: job.id }
    } catch (error: any) {
        console.error('Error creating job:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create job listing'
        })
    }
})
