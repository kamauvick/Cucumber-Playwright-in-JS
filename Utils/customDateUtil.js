let date;

export async function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 2);
  
    return previous.toISOString();
  }

export {date};