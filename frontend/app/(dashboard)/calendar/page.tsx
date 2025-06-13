"use client";

import { format, isValid } from 'date-fns';
import { Calendar as CalendarIcon, Edit, PlusCircle, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: Date;
  type: 'info' | 'warning' | 'alert';
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '' });
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'alert'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  // Function to fetch events and announcements
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventsResponse, announcementsResponse] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/announcements')
      ]);

      if (!eventsResponse.ok || !announcementsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [eventsData, announcementsData] = await Promise.all([
        eventsResponse.json(),
        announcementsResponse.json()
      ]);

      setEvents(eventsData);
      setAnnouncements(announcementsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // Date dots for events
  const eventDates = events.map(event => {
    try {
      const date = new Date(event.date);
      return isValid(date) ? date : null;
    } catch (e) {
      return null;
    }
  }).filter(Boolean) as Date[];

  // Filter events for the selected date
  const selectedDateEvents = events.filter(
    event => event.date === formattedDate
  );

  // Handle event form submission
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingEvent ? 'PUT' : 'POST';
      const body = editingEvent 
        ? JSON.stringify({...eventForm, id: editingEvent, date: formattedDate}) 
        : JSON.stringify({...eventForm, date: formattedDate});
      
      const response = await fetch('/api/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      fetchData();
      setEventForm({ title: '', description: '' });
      setShowAddEvent(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
    }
  };

  // Handle announcement form submission
  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingAnnouncement ? 'PUT' : 'POST';
      const body = editingAnnouncement 
        ? JSON.stringify({...announcementForm, id: editingAnnouncement}) 
        : JSON.stringify(announcementForm);
      
      const response = await fetch('/api/announcements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!response.ok) {
        throw new Error('Failed to save announcement');
      }

      fetchData();
      setAnnouncementForm({ title: '', content: '', type: 'info' });
      setShowAddAnnouncement(false);
      setEditingAnnouncement(null);
    } catch (err) {
      console.error('Error saving announcement:', err);
      setError('Failed to save announcement. Please try again.');
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      fetchData();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  // Handle deleting an announcement
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const response = await fetch(`/api/announcements?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete announcement');
      }

      fetchData();
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement. Please try again.');
    }
  };

  // Load event for editing
  const handleEditEvent = (event: Event) => {
    setEventForm({ title: event.title, description: event.description });
    setEditingEvent(event.id);
    setShowAddEvent(true);
  };

  // Load announcement for editing
  const handleEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementForm({ 
      title: announcement.title, 
      content: announcement.content, 
      type: announcement.type 
    });
    setEditingAnnouncement(announcement._id);
    setShowAddAnnouncement(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <CalendarIcon className="mr-3 text-blue-600" />
          Calendar &amp; Announcements
        </h1>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setShowAddEvent(true);
              setEditingEvent(null);
              setEventForm({ title: '', description: '' });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          >
            <PlusCircle className="mr-2" size={18} />
            Add Event
          </button>
          <button 
            onClick={() => {
              setShowAddAnnouncement(true);
              setEditingAnnouncement(null);
              setAnnouncementForm({ title: '', content: '', type: 'info' });
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          >
            <PlusCircle className="mr-2" size={18} />
            Add Announcement
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Calendar</h2>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: '#ebf4ff',
                color: '#1e40af',
                fontWeight: 'bold',
              },
            }}
            className="mx-auto"
          />
          <p className="text-center text-gray-500 mt-4">
            Selected: {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>

        {/* Events */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Events for {format(selectedDate, 'MMM d, yyyy')}
            </h2>
            <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
              {selectedDateEvents.length} events
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No events scheduled for this date</p>
            ) : (
              selectedDateEvents.map((event) => (
                <div key={event.id} className="bg-blue-50 rounded-lg p-4 relative group">
                  <h3 className="font-semibold text-blue-900">{event.title}</h3>
                  <p className="mt-1 text-blue-700">{event.description}</p>
                  
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditEvent(event)}
                      className="p-1 bg-blue-100 rounded-full hover:bg-blue-200"
                    >
                      <Edit size={16} className="text-blue-700" />
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1 bg-red-100 rounded-full hover:bg-red-200"
                    >
                      <Trash2 size={16} className="text-red-700" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Announcements</h2>
            <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium">
              {announcements.length} total
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {announcements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No announcements available</p>
            ) : (
              announcements.map((announcement) => (
                <div 
                  key={announcement._id} 
                  className={`rounded-lg p-4 relative group ${
                    announcement.type === 'warning' ? 'bg-yellow-50' :
                    announcement.type === 'alert' ? 'bg-red-50' : 'bg-green-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                      <p className="mt-1 text-gray-700">{announcement.content}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        {format(new Date(announcement.date), 'MMM d, yyyy, h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="p-1 bg-green-100 rounded-full hover:bg-green-200"
                    >
                      <Edit size={16} className="text-green-700" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                      className="p-1 bg-red-100 rounded-full hover:bg-red-200"
                    >
                      <Trash2 size={16} className="text-red-700" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEvent ? 'Edit Event' : 'Add Event'}
              </h2>
              <button onClick={() => setShowAddEvent(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  id="eventTitle"
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="eventDesc" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Description
                </label>
                <textarea
                  id="eventDesc"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event description"
                  rows={4}
                  required
                />
              </div>
              
              <div className="pt-2">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Date: {format(selectedDate, 'MMMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingEvent ? 'Update' : 'Add'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Announcement Modal */}
      {showAddAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingAnnouncement ? 'Edit Announcement' : 'Add Announcement'}
              </h2>
              <button onClick={() => setShowAddAnnouncement(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              <div>
                <label htmlFor="announcementTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Announcement Title
                </label>
                <input
                  id="announcementTitle"
                  type="text"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter announcement title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="announcementContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Announcement Content
                </label>
                <textarea
                  id="announcementContent"
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter announcement content"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="announcementType" className="block text-sm font-medium text-gray-700 mb-1">
                  Announcement Type
                </label>
                <select
                  id="announcementType"
                  value={announcementForm.type}
                  onChange={(e) => setAnnouncementForm({ 
                    ...announcementForm, 
                    type: e.target.value as 'info' | 'warning' | 'alert' 
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncement(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  {editingAnnouncement ? 'Update' : 'Add'} Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
