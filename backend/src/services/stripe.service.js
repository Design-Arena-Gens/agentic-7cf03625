import Stripe from 'stripe';

let stripeClient;

export function getStripeClient() {
  if (!stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    stripeClient = new Stripe(apiKey, { apiVersion: '2023-10-16' });
  }
  return stripeClient;
}

export async function ensureCustomer(user) {
  const stripe = getStripeClient();
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.fullName,
    metadata: {
      affiliateId: user.affiliateId,
      userId: user._id.toString(),
    },
  });

  return customer.id;
}

export async function createPaymentIntent({ amount, currency = 'usd', customerId, metadata }) {
  const stripe = getStripeClient();
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}
