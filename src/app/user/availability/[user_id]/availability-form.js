'use client'

import { useEffect, useState } from 'react';
import { Plus, Minus, Save } from 'lucide-react';
import { validateSchedule } from '@/utils/validation';
import { saveAvailability } from '@/app/actions/availability';

const defaultTimeSlot = {
    start: '9:00am',
    end: '5:00pm'
};

const DAYS = [
    { letter: 'S', full: 'Sunday', enabled: false },
    { letter: 'M', full: 'Monday', enabled: true },
    { letter: 'T', full: 'Tuesday', enabled: true },
    { letter: 'W', full: 'Wednesday', enabled: true },
    { letter: 'T', full: 'Thursday', enabled: true },
    { letter: 'F', full: 'Friday', enabled: true },
    { letter: 'S', full: 'Saturday', enabled: false }
];

const defaultSchedule = DAYS.reduce((acc, day) => ({
    ...acc,
    [day.full]: {
        enabled: day.enabled,
        timeSlots: [{ ...defaultTimeSlot }]
    }
}), {});

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

    const toggleDay = (dayName) => {
        setSchedule(prev => ({
            ...prev,
            [dayName]: {
                ...prev[dayName],
                enabled: !prev[dayName].enabled
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
        <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto border border-black">
            <div className="flex gap-2 mb-8">
                {DAYS.map((day) => (
                    <button
                        key={`${day.letter}-${day.full}`}
                        onClick={() => toggleDay(day.full)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors
                            ${schedule[day.full].enabled ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                        {day.letter}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {DAYS.map((dayItem) => (
                    schedule[dayItem.full].enabled && (
                        <div key={dayItem.full} className="flex items-start gap-4 mt-4">
                            <div className="font-semibold text-gray-700 text-left pr-4 mt-6 min-w-36 ">{dayItem.full}</div>
                            <div className="space-y-4">
                                {schedule[dayItem.full].timeSlots.map((slot, index) => (
                                    <div key={index} className="flex items-center gap-4 p-2">
                                       <div className="flex items-center gap-4 border border-gray-300 rounded-md p-2">
                                        <input
                                            type="text"
                                            value={slot.start}
                                            onChange={(e) => updateTimeSlot(dayItem.full, index, 'start', e.target.value)}
                                            className="w-24 px-3 py-2"
                                            placeholder="9:00am"
                                        />
                                        <span className="text-gray-600">to</span>
                                        <input
                                            type="text"
                                            value={slot.end}
                                            onChange={(e) => updateTimeSlot(dayItem.full, index, 'end', e.target.value)}
                                            className="w-24 px-3 py-2  "
                                            placeholder="5:00pm"
                                        />
                                        </div>
                                        <button
                                            onClick={() => addTimeSlot(dayItem.full)}
                                            className="p-2 text-blue-600 hover:text-blue-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => removeTimeSlot(dayItem.full, index)}
                                            disabled={schedule[dayItem.full].timeSlots.length === 1}
                                            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
                {/* </div> */}

                <button
                    onClick={handleSave}
                    disabled={!isValid}
                    className="mt-6 max-w-64 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save Availability
                </button>
            </div>
        </div>
    );
}