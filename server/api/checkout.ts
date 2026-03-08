import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    if (!config.stripeSecretKey || config.stripeSecretKey.includes('sk_test_...')) {
        // Return a mock success response if Stripe is not configured
        return {
            url: null,
            message: 'Stripe is not configured. Returning simulated success.'
        }
    }

    try {
        const stripe = new Stripe(config.stripeSecretKey)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Job Posting: ${body.title} at ${body.company}`,
                            description: 'Standard 30-day job listing on Creative Jobs List',
                        },
                        unit_amount: 29900, // $299.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${config.public.siteUrl || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.public.siteUrl || 'http://localhost:3000'}/post`,
            metadata: {
                jobTitle: body.title,
                companyName: body.company
                // Here you would also include the job ID from Supabase to update its status via Webhook later:
                // jobId: body.jobId 
            }
        })

        return {
            url: session.url
        }
    } catch (error: any) {
        console.error('Error creating Stripe checkout session', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Internal Server Error'
        })
    }
})
