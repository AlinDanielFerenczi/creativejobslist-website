import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Job ID missing' })
    }

    try {
        const job = await prisma.job.findUnique({
            where: { id }
        })

        if (!job) {
            throw createError({ statusCode: 404, statusMessage: 'Job not found' })
        }

        return job
    } catch (error) {
        console.error('Error fetching single job via Prisma:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch job'
        })
    }
})
