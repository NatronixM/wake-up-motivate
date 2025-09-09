import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Preferences } from "@capacitor/preferences";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { defaultTracks, MotivationalTrack } from "@/data/motivationalTracks";
import { 
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Edit,
  Clock,
  Music,
  Bell
} from "lucide-react";

interface EventAlarm {
  id: string;
  date: Date;
  message: string;
  time: string;
  track: string;
  reminders: { enabled: boolean; time: string; unit: string }[];
}

export const EventCalendar = () => {
  const [eventOpen, setEventOpen] = useState(false);
  const [events, setEvents] = useState<EventAlarm[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [eventMessage, setEventMessage] = useState("");
  const [eventTime, setEventTime] = useState("09:00");
  const [selectedTrack, setSelectedTrack] = useState<string>(defaultTracks[0].id);
  const [reminders, setReminders] = useState([
    { enabled: true, time: "15", unit: "minutes" },
    { enabled: false, time: "1", unit: "hours" },
    { enabled: false, time: "1", unit: "days" }
  ]);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const existingEvents = await Preferences.get({ key: 'eventAlarms' });
      if (existingEvents.value) {
        const parsedEvents = JSON.parse(existingEvents.value).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const saveEventAlarm = async () => {
    if (selectedDate && eventMessage && eventTime) {
      const eventData: EventAlarm = {
        id: Date.now().toString(),
        date: selectedDate,
        message: eventMessage,
        time: eventTime,
        track: selectedTrack,
        reminders: reminders.filter(r => r.enabled)
      };

      try {
        const updatedEvents = [...events, eventData];
        setEvents(updatedEvents);
        
        await Preferences.set({
          key: 'eventAlarms',
          value: JSON.stringify(updatedEvents)
        });

        // Reset form
        setEventOpen(false);
        setSelectedDate(undefined);
        setEventMessage("");
        setEventTime("09:00");
        setSelectedTrack(defaultTracks[0].id);
        setReminders([
          { enabled: true, time: "15", unit: "minutes" },
          { enabled: false, time: "1", unit: "hours" },
          { enabled: false, time: "1", unit: "days" }
        ]);
      } catch (error) {
        console.error('Failed to save event alarm:', error);
      }
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      
      await Preferences.set({
        key: 'eventAlarms',
        value: JSON.stringify(updatedEvents)
      });
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const updateReminder = (index: number, field: string, value: any) => {
    const newReminders = [...reminders];
    newReminders[index] = { ...newReminders[index], [field]: value };
    setReminders(newReminders);
  };

  const addCustomReminder = () => {
    setReminders([...reminders, { enabled: true, time: "30", unit: "minutes" }]);
  };

  const removeReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const getTrackName = (trackId: string) => {
    const track = defaultTracks.find(t => t.id === trackId);
    return track?.name || 'Unknown Track';
  };

  // Get events for selected calendar date
  const eventsForDate = selectedDate 
    ? events.filter(event => 
        format(event.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      )
    : [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Event Calendar" />
      
      <div className="px-4 space-y-6">
        {/* Calendar */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Select Date</h3>
              <Button
                size="sm"
                onClick={() => setEventOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className={cn("rounded-md border-0")}
              modifiers={{
                hasEvent: events.map(event => event.date)
              }}
              modifiersClassNames={{
                hasEvent: "bg-primary/20 text-primary font-semibold"
              }}
            />
          </div>
        </Card>

        {/* Events for Selected Date */}
        {selectedDate && (
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Events for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              
              {eventsForDate.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No events scheduled for this date
                </p>
              ) : (
                <div className="space-y-3">
                  {eventsForDate.map((event) => (
                    <Card key={event.id} className="bg-card/50 border-border/30 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{event.time}</span>
                          </div>
                          
                          <p className="text-foreground font-medium">{event.message}</p>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Music className="h-3 w-3" />
                            <span>{getTrackName(event.track)}</span>
                          </div>
                          
                          {event.reminders.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Bell className="h-3 w-3" />
                              <span>
                                {event.reminders.length} reminder{event.reminders.length > 1 ? 's' : ''} set
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h3>
            
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No events scheduled. Create your first event!
              </p>
            ) : (
              <div className="space-y-3">
                {events
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <Card key={event.id} className="bg-card/50 border-border/30 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{format(event.date, 'MMM d, yyyy')}</span>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>{event.time}</span>
                          </div>
                          
                          <p className="text-foreground font-medium">{event.message}</p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Music className="h-3 w-3" />
                            <span>{getTrackName(event.track)}</span>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={eventOpen} onOpenChange={setEventOpen}>
        <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Event Alarm</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Set up a custom alarm for your event with reminders.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-date" className="text-sm font-medium text-foreground">
                Select Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="event-time" className="text-sm font-medium text-foreground">
                Time
              </Label>
              <Input
                id="event-time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="event-message" className="text-sm font-medium text-foreground">
                Event Message
              </Label>
              <Input
                id="event-message"
                placeholder="Enter your event message..."
                value={eventMessage}
                onChange={(e) => setEventMessage(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-foreground">
                Motivational Track
              </Label>
              <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a motivational track" />
                </SelectTrigger>
                <SelectContent>
                  {defaultTracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{track.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {track.category} • {track.duration}s
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-foreground">
                  Reminder Times
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addCustomReminder}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      checked={reminder.enabled}
                      onCheckedChange={(checked) => 
                        updateReminder(index, 'enabled', checked)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Time"
                      value={reminder.time}
                      onChange={(e) => updateReminder(index, 'time', e.target.value)}
                      className="w-16 h-8"
                      min="1"
                    />
                    <Select
                      value={reminder.unit}
                      onValueChange={(value) => updateReminder(index, 'unit', value)}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">min</SelectItem>
                        <SelectItem value="hours">hrs</SelectItem>
                        <SelectItem value="days">days</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">before</span>
                    {reminders.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReminder(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEventOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={saveEventAlarm}
                disabled={!selectedDate || !eventMessage}
                className="flex-1"
              >
                Save Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};