/**
 * Get the current time period (morning, afternoon, evening, night)
 * @returns The current time period
 */
export function getCurrentTimePeriod(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const currentHour = new Date().getHours();
  
  if (currentHour >= 5 && currentHour < 12) {
    return 'morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'afternoon';
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}