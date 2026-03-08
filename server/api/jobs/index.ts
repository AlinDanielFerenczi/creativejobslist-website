import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        const jobs = await prisma.job.findMany({
            where: {
                status: 'published'
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return jobs
    } catch (error) {
        console.error('Error fetching jobs via Prisma:', error)
        return createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch jobs'
        })
    }
})
