export const users = {
  valid: {
    email: process.env.EVENTHUB_EMAIL ?? 'qaonkar7@mailinator.com',
    password: process.env.EVENTHUB_PASSWORD ?? 'Qa@123456',
  },
  invalid: {
    email: 'wrong.user@example.com',
    password: 'WrongPassword123!',
  },
};