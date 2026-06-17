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


export function secondAdminEventData() {

  const suffix1 = Date.now().toString().slice(-6);

  return {
    title: `Football world ${suffix1}`,
    updatedTitle: `Football world cup event ${suffix1} Updated`,
    description: 'Football world cup event', 
    category: 'Sports',
    city: 'Mumbai',
    eventDateTime: '2026-11-20T18:00',
     price: 500,
     totalSeats: 200,
    
  }
}

