import { getAvailability } from '@/app/actions/availability';
import AvailabilityForm from './availability-form';

export default async function AvailabilityPage({ params: { userId } }) {
  const initialSchedule = await getAvailability(userId);
  
  return (
    <div className="container mx-auto py-8">
      {/* <h1 className="text-2xl font-bold mb-6">Weekly Availability</h1> */}
      <AvailabilityForm userId={userId} initialSchedule={initialSchedule} />
    </div>
  );
}