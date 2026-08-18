function getFutureEventDateTime(daysAhead = 30) {
  const date = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function createAdminEventData() {
  const suffix = Date.now().toString().slice(-6);

  return {
    title: `PW Admin Event ${suffix}`,
    updatedTitle: `PW Admin Event ${suffix} Updated`,
    description: 'Playwright admin automation event',
    category: 'Workshop',
    city: 'Bangalore',
    venue: 'Indiranagar, Bangalore',
    eventDateTime: getFutureEventDateTime(),
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
    eventDateTime: getFutureEventDateTime(45),
     price: 500,
     totalSeats: 200,
    
  }
}

