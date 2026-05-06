export function createAdminEventData() {
  const suffix = Date.now().toString().slice(-6);

  return {
    title: `PW Admin Event ${suffix}`,
    updatedTitle: `PW Admin Event ${suffix} Updated`,
    description: 'Playwright admin automation event',
    category: 'Workshop',
    city: 'Bangalore',
    venue: 'Indiranagar, Bangalore',
    eventDateTime: '2026-06-15T10:30',
    price: 250,
    totalSeats: 150,
  };
}