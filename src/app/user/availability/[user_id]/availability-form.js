'use client'

import { useEffect, useState } from 'react';
import { Plus, Minus, Save } from 'lucide-react';
import { validateSchedule } from '@/utils/validation';
import { saveAvailability } from '../../../actions/availability';

const defaultTimeSlot = {
  start: '9:00am',
  end: '5:00pm'
};

const defaultDaySchedule = {
  enabled: true,
  timeSlots: [{ ...defaultTimeSlot }]
};

const defaultSchedule = {
  Monday: { ...defaultDaySchedule },
  Tuesday: { ...defaultDaySchedule },
  Wednesday: { ...defaultDaySchedule },
  Thursday: { ...defaultDaySchedule },
  Friday: { ...defaultDaySchedule },
  Saturday: { ...defaultDaySchedule, enabled: false },
  Sunday: { ...defaultDaySchedule, enabled: false }
};

export default function AvailabilityForm({ userId, initialSchedule }) {
  const [schedule, setSchedule] = useState(initialSchedule || defaultSchedule);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(validateSchedule(schedule));
  }, [schedule]);

  const addTimeSlot = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { ...defaultTimeSlot }]
      }
    }));
  };

  const removeTimeSlot = (day, index) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTimeSlot = (day, index, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
  };

  const handleSave = async () => {
    try {
      await saveAvailability(userId, schedule);
    } catch (error) {
      alert('Failed to save schedule. Please check your inputs and try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {Object.entries(schedule).map(([day, daySchedule]) => (
          <div key={day} className="space-y-2">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={daySchedule.enabled}
                onChange={() => toggleDay(day)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {/* <span className="font-medium w-32 text-gray-700">{day}</span> */}
            </div>
            
            {daySchedule.enabled && (
              <div className="ml-8 space-y-2">
                {daySchedule.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={slot.start}
                      onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="9:00am"
                    />
                    <span className="text-gray-600">to</span>
                    <input
                      type="text"
                      value={slot.end}
                      onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5:00pm"
                    />
                    <button
                      onClick={() => removeTimeSlot(day, index)}
                      disabled={daySchedule.timeSlots.length === 1}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTimeSlot(day)}
                  className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time Slot
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={handleSave}
          disabled={!isValid}
          className="mt-6 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Availability
        </button>
      </div>
    </div>
  );
}