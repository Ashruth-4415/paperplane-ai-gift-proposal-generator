import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const EVENTS = {
  '2026-07-01': [{ label: 'Q3 Kickoff', color: 'bg-brand-600', type: 'corporate' }],
  '2026-07-05': [{ label: 'Meridian Delivery', color: 'bg-amber-500', type: 'delivery' }],
  '2026-07-15': [{ label: 'TechNova Delivery', color: 'bg-emerald-500', type: 'delivery' }],
  '2026-07-20': [{ label: 'Dealer Awards', color: 'bg-violet-500', type: 'event' }],
  '2026-08-01': [{ label: 'GreenPath Delivery', color: 'bg-teal-500', type: 'delivery' }],
  '2026-08-15': [{ label: 'Skyline Delivery', color: 'bg-pink-500', type: 'delivery' }],
  '2026-06-20': [{ label: 'Monthly Review', color: 'bg-surface-500', type: 'internal' }],
  '2026-06-25': [{ label: 'Client Anniversary', color: 'bg-rose-500', type: 'milestone' }],
  '2026-07-10': [{ label: 'Mid-Year Review', color: 'bg-orange-500', type: 'internal' }],
  '2026-07-25': [{ label: 'Client Anniversary', color: 'bg-rose-500', type: 'milestone' }],
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function OccasionCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const pad = (n) => String(n).padStart(2, '0');
  const key = (d) => d ? `${year}-${pad(month + 1)}-${pad(d)}` : null;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const todayKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const selectedEvents = selected && EVENTS[selected] ? EVENTS[selected] : [];

  const typeLabels = { corporate: 'Corporate Event', delivery: 'Delivery Date', event: 'External Event', internal: 'Internal Meeting', milestone: 'Client Milestone' };

  return (
    <div className="bg-surface-800 border border-surface-700/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-700/50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-600/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-surface-100 font-semibold text-sm">Occasion Calendar</h3>
            <p className="text-surface-500 text-xs">Corporate milestones & delivery dates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-surface-200 text-sm font-semibold min-w-[120px] text-center">{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-surface-500 py-1">{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const k = key(day);
            const events = k ? EVENTS[k] : null;
            const isToday = k === todayKey;
            const isSelected = k === selected;
            return (
              <button
                key={i}
                onClick={() => day && setSelected(k)}
                disabled={!day}
                className={`relative aspect-square flex flex-col items-center justify-start pt-1 rounded-xl text-xs font-medium transition-all ${!day ? 'invisible' : ''} ${isSelected ? 'bg-brand-600 text-white' : isToday ? 'bg-brand-900/40 text-brand-300 border border-brand-500/40' : 'hover:bg-surface-700/50 text-surface-300'}`}
              >
                <span>{day}</span>
                {events && (
                  <div className="flex gap-0.5 mt-0.5">
                    {events.map((ev, j) => (
                      <span key={j} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : ev.color}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Event detail */}
        {selected && (
          <div className="mt-4 pt-4 border-t border-surface-700/40">
            <p className="text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">
              {selected} {selectedEvents.length === 0 ? '— No events' : `— ${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''}`}
            </p>
            {selectedEvents.map((ev, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <span className={`w-2 h-2 rounded-full ${ev.color} flex-shrink-0`} />
                <span className="text-surface-200 text-sm">{ev.label}</span>
                <span className="ml-auto text-xs text-surface-500">{typeLabels[ev.type]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-surface-700/40 flex flex-wrap gap-3">
          {[
            { label: 'Corporate', color: 'bg-brand-500' },
            { label: 'Delivery', color: 'bg-emerald-500' },
            { label: 'Milestone', color: 'bg-rose-500' },
            { label: 'Internal', color: 'bg-surface-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-xs text-surface-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
