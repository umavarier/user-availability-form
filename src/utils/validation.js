export const validateTimeFormat = (time) => {
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$/i;
  return timeRegex.test(time);
};

export const convertTo24Hour = (time) => {
  const [hourMin, period] = time.split(/(?=[ap]m)/i);
  let [hours, minutes] = hourMin.split(':');
  let hoursNum = parseInt(hours);
  
  if (period.toLowerCase() === 'pm' && hoursNum !== 12) {
    hoursNum += 12;
  } else if (period.toLowerCase() === 'am' && hoursNum === 12) {
    hoursNum = 0;
  }
  
  return `${hoursNum.toString().padStart(2, '0')}:${minutes}`;
};

export const validateTimeSlots = (timeSlots) => {
  const sortedSlots = [...timeSlots].sort((a, b) => 
    convertTo24Hour(a.start).localeCompare(convertTo24Hour(b.start))
  );

  for (let i = 0; i < sortedSlots.length; i++) {
    const slot = sortedSlots[i];
    
    if (!validateTimeFormat(slot.start) || !validateTimeFormat(slot.end)) {
      return false;
    }
    
    if (convertTo24Hour(slot.start) >= convertTo24Hour(slot.end)) {
      return false;
    }
    
    if (i > 0) {
      const previousSlot = sortedSlots[i - 1];
      if (convertTo24Hour(previousSlot.end) > convertTo24Hour(slot.start)) {
        return false;
      }
    }
  }
  
  return true;
};

export const validateSchedule = (schedule) => {
  const hasEnabledDay = Object.values(schedule).some(day => day.enabled);
  if (!hasEnabledDay) return false;

  return Object.entries(schedule).every(([_, day]) => 
    !day.enabled || validateTimeSlots(day.timeSlots)
  );
};
