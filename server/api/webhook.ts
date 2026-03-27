import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // Return early if Stripe isn't fully configured
    if (!config.stripeSecretKey || config.stripeSecretKey.includes('sk_test_...')) {
        return { received: true, simulated: true }
    }

    const stripe = new Stripe(config.stripeSecretKey)
    const body = await readRawBody(event)
    const signature = getHeader(event, 'stripe-signature')

    if (!signature || !body) {
        throw createError({ statusCode: 400, statusMessage: 'Missing signature or body' })
    }

    let stripeEvent: Stripe.Event;

    try {
        stripeEvent = stripe.webhooks.constructEvent(
            body,
            signature,
            config.stripeWebhookSecret
        )
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        throw createError({ statusCode: 400, statusMessage: `Webhook Error: ${err.message}` })
    }

    // Handle the event
    switch (stripeEvent.type) {
        case 'checkout.session.completed':
            const session = stripeEvent.data.object as Stripe.Checkout.Session
            console.log(`✅ Checkout completed for session ${session.id}`)

            // If metadata was passed during checkout.ts, log it
            if (session.metadata) {
                console.log(`Job Title: ${session.metadata.jobTitle}`)
                console.log(`Company: ${session.metadata.companyName}`)
                const jobId = session.metadata.jobId
                if (jobId) {
                    try {
                        const prisma = (await import('../utils/prisma')).default
                        await prisma.job.update({
                            where: { id: jobId },
                            data: { status: 'published' }
                        })
                        console.log(`✅ Successfully published job via Prisma`)
                    } catch (err) {
                        console.error(`Error updating job with Prisma:`, err)
                    }
                }
            }
            break

        case 'checkout.session.expired': {
            const expiredSession = stripeEvent.data.object as Stripe.Checkout.Session
            console.log(`Checkout expired for session ${expiredSession.id}`)
            const expiredJobId = expiredSession.metadata?.jobId
            if (expiredJobId) {
                try {
                    const prismaClient = (await import('../utils/prisma')).default
                    await prismaClient.job.delete({
                        where: { id: expiredJobId, status: 'pending_payment' }
                    })
                    console.log(`Deleted pending job ${expiredJobId} after expired checkout`)
                } catch (err) {
                    console.error('Error deleting expired job:', err)
                }
            }
            break
        }

        default:
            console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return { received: true }
})
