import React from 'react';

export default function ActivitiesPage() {
  // Mock data for activities
  const activities = [
    {
      id: 1,
      name: 'Youth Sports Program',
      category: 'Sports',
      coordinator: 'Michael Cohen',
      participants: 25,
      schedule: 'Every Tuesday, 4:00 PM - 6:00 PM',
      location: 'Community Sports Center',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Reading Circle',
      category: 'Education',
      coordinator: 'Sarah Levy',
      participants: 15,
      schedule: 'Every Monday & Wednesday, 5:00 PM - 6:30 PM',
      location: 'Public Library, Room 3',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Community Garden',
      category: 'Environment',
      coordinator: 'David Goldstein',
      participants: 8,
      schedule: 'Saturday mornings, 9:00 AM - 11:00 AM',
      location: 'North Side Community Plot',
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'Coding Workshop',
      category: 'Technology',
      coordinator: 'Rachel Berkowitz',
      participants: 12,
      schedule: 'Fridays, 3:00 PM - 5:00 PM',
      location: 'Tech Hub, Floor 2',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Dance Classes',
      category: 'Arts',
      coordinator: 'Leah Aharoni',
      participants: 20,
      schedule: 'Every Thursday, 6:00 PM - 8:00 PM',
      location: 'Community Center Auditorium',
      status: 'Active'
    }
  ];

  const categories = ['All', 'Sports', 'Education', 'Environment', 'Technology', 'Arts'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Activities</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Activity
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search activities..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
        
        <div className="flex space-x-2 items-center overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full border ${
                category === 'All' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">{activity.name}</h2>
                  <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Category: {activity.category}</p>
              </div>
              
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-200 rounded-md">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-200 rounded-md">
                  Delete
                </button>
                <button className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700">
                  View Details
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Coordinator</p>
                <p>{activity.coordinator}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Schedule</p>
                <p>{activity.schedule}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>{activity.location}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500">Participants</p>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(activity.participants / 30 * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{activity.participants}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 