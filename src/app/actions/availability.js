'use server'

import { getFromCache, setInCache } from '@/lib/memcache..js';
import { validateSchedule } from '../../utils/validation.js';
import { revalidatePath } from 'next/cache';

export async function getAvailability(userId) {
  try {
    const data = await getFromCache(`availability:${userId}`);
    return data || null;
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    return null;
  }
}

export async function saveAvailability(userId, schedule) {
  if (!validateSchedule(schedule)) {
    throw new Error('Invalid schedule data');
  }
console.log(schedule, "schedule", userId)
  try {
    await setInCache(`availability:${userId}`, schedule);
    revalidatePath(`/user/availability/${userId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to save availability:', error);
    throw new Error('Failed to save schedule');
  }
}