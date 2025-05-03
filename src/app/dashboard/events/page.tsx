import React from 'react';

export default function EventsPage() {
  // Mock data for events
  const events = [
    { 
      id: 1, 
      title: 'Annual Conference', 
      date: '2024-06-15', 
      time: '09:00 AM - 05:00 PM',
      location: 'Main Hall, Tel Aviv',
      capacity: 150,
      registrations: 120
    },
    { 
      id: 2, 
      title: 'Youth Workshop', 
      date: '2024-07-10', 
      time: '02:00 PM - 06:00 PM',
      location: 'Community Center, Jerusalem',
      capacity: 50,
      registrations: 35
    },
    { 
      id: 3, 
      title: 'Volunteer Training', 
      date: '2024-07-25', 
      time: '10:00 AM - 01:00 PM',
      location: 'Meeting Room 3, Haifa',
      capacity: 30,
      registrations: 28
    },
    { 
      id: 4, 
      title: 'Summer Camp', 
      date: '2024-08-05', 
      time: '08:00 AM - 04:00 PM',
      location: 'Outdoor Park, Eilat',
      capacity: 80,
      registrations: 45
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
        <input
          type="date"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Locations</option>
          <option value="tel-aviv">Tel Aviv</option>
          <option value="jerusalem">Jerusalem</option>
          <option value="haifa">Haifa</option>
          <option value="eilat">Eilat</option>
        </select>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">⏰</span>
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-1">
                {event.registrations} registrations out of {event.capacity} capacity
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 