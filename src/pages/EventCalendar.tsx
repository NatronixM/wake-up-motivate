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
import { useMotivationalQuotes } from "@/hooks/useMotivationalQuotes";
import { BannerAd } from "@/components/BannerAd";
import { 
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Edit,
  Clock,
  Music,
  Bell,
  Sparkles,
  Star,
  Heart,
  RefreshCw
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

  // Use the motivational quotes hook
  const { quote, isLoading: quoteLoading, refreshQuote } = useMotivationalQuotes();

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
      
      <div className="px-4 space-y-8">
        {/* Banner Ad */}
        <div className="pt-4">
          <BannerAd />
        </div>

        {/* Calendar */}
        <Card className="bg-gradient-to-br from-card/90 to-card/50 border-border/30 shadow-elegant backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-transparent p-1">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Select Date</h3>
                      <p className="text-sm text-muted-foreground">Choose when to schedule your event</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setEventOpen(true)}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
                
                <div className="bg-gradient-to-br from-background/50 to-background/20 rounded-xl p-4 border border-border/30">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className={cn("rounded-lg border-0 mx-auto")}
                    modifiers={{
                      hasEvent: events.map(event => event.date)
                    }}
                    modifiersClassNames={{
                      hasEvent: "bg-gradient-to-br from-primary/30 to-primary/20 text-primary font-bold border-2 border-primary/40 shadow-md scale-105"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Events for Selected Date */}
        {selectedDate && (
          <Card className="bg-gradient-to-br from-card/90 to-card/50 border-border/30 shadow-elegant backdrop-blur-sm animate-fade-in">
            <div className="bg-gradient-to-r from-accent/5 to-transparent p-1">
              <div className="bg-card/90 backdrop-blur-sm rounded-lg">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-accent/10 rounded-xl">
                      <Star className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        Events for {format(selectedDate, 'MMMM d, yyyy')}
                      </h3>
                      <p className="text-sm text-muted-foreground">Your scheduled motivational moments</p>
                    </div>
                  </div>
                  
                  {eventsForDate.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 bg-muted/20 rounded-2xl w-fit mx-auto mb-4">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-lg font-medium mb-2">No events scheduled</p>
                      <p className="text-sm text-muted-foreground">Add your first motivational event for this date!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {eventsForDate.map((event, index) => (
                        <Card key={event.id} className="bg-gradient-to-r from-background/80 to-background/40 border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Clock className="h-4 w-4 text-primary" />
                                  </div>
                                  <span className="font-bold text-lg text-foreground">{event.time}</span>
                                </div>
                                
                                <div className="bg-gradient-to-r from-primary/5 to-transparent p-3 rounded-lg border-l-4 border-primary/30">
                                  <p className="text-foreground font-semibold text-lg">{event.message}</p>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground bg-muted/20 rounded-full px-3 py-1">
                                    <Music className="h-3 w-3" />
                                    <span className="font-medium">{getTrackName(event.track)}</span>
                                  </div>
                                  
                                  {event.reminders.length > 0 && (
                                    <div className="flex items-center gap-2 text-muted-foreground bg-accent/10 rounded-full px-3 py-1">
                                      <Bell className="h-3 w-3 text-accent" />
                                      <span className="font-medium">
                                        {event.reminders.length} reminder{event.reminders.length > 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteEvent(event.id)}
                                className="h-9 w-9 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card className="bg-gradient-to-br from-card/90 to-card/50 border-border/30 shadow-elegant backdrop-blur-sm">
          <div className="bg-gradient-to-r from-secondary/5 to-transparent p-1">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-secondary/10 rounded-xl">
                    <Heart className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Upcoming Events</h3>
                    <p className="text-sm text-muted-foreground">Your next motivational milestones</p>
                  </div>
                </div>
                
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-muted/20 rounded-2xl w-fit mx-auto mb-4">
                      <Sparkles className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-lg font-medium mb-2">No events scheduled</p>
                    <p className="text-sm text-muted-foreground">Create your first motivational event to get started!</p>
                    <Button 
                      onClick={() => setEventOpen(true)}
                      className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .slice(0, 5)
                      .map((event, index) => (
                        <Card key={event.id} className="bg-gradient-to-r from-background/80 to-background/40 border-border/20 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] group">
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1">
                                    <CalendarIcon className="h-3 w-3 text-primary" />
                                    <span className="font-medium text-primary">{format(event.date, 'MMM d, yyyy')}</span>
                                  </div>
                                  <div className="flex items-center gap-2 bg-accent/10 rounded-full px-3 py-1">
                                    <Clock className="h-3 w-3 text-accent" />
                                    <span className="font-medium text-accent">{event.time}</span>
                                  </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-muted/20 to-transparent p-3 rounded-lg border-l-4 border-muted/40">
                                  <p className="text-foreground font-semibold">{event.message}</p>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/10 rounded-full px-3 py-1 w-fit">
                                  <Music className="h-3 w-3" />
                                  <span className="font-medium">{getTrackName(event.track)}</span>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteEvent(event.id)}
                                className="h-9 w-9 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={eventOpen} onOpenChange={setEventOpen}>
        <DialogContent className="bg-gradient-to-br from-card/95 to-card/80 border-border/30 shadow-2xl backdrop-blur-lg max-w-md max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-primary/5 to-transparent p-1 rounded-t-lg">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg">
              <DialogHeader className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Create Event Alarm
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground">
                  Set up a custom motivational alarm for your special event with personalized reminders.
                </DialogDescription>
              </DialogHeader>
              
              <div className="px-6 pb-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <Label htmlFor="event-date" className="text-sm font-semibold text-foreground">
                      Select Date
                    </Label>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background/50 border-border/30 hover:bg-background/70 transition-all duration-200",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card/95 border-border/30 shadow-xl backdrop-blur-lg" align="start">
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
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <Label htmlFor="event-time" className="text-sm font-semibold text-foreground">
                      Time
                    </Label>
                  </div>
                  <Input
                    id="event-time"
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="bg-background/50 border-border/30 focus:bg-background/70 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-secondary" />
                    <Label htmlFor="event-message" className="text-sm font-semibold text-foreground">
                      Event Message
                    </Label>
                  </div>
                  <Input
                    id="event-message"
                    placeholder="Enter your motivational event message..."
                    value={eventMessage}
                    onChange={(e) => setEventMessage(e.target.value)}
                    className="bg-background/50 border-border/30 focus:bg-background/70 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-semibold text-foreground">
                      Motivational Track
                    </Label>
                  </div>
                  <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                    <SelectTrigger className="bg-background/50 border-border/30 hover:bg-background/70 transition-all duration-200">
                      <SelectValue placeholder="Choose a motivational track" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/95 border-border/30 shadow-xl backdrop-blur-lg">
                      {defaultTracks.map((track) => (
                        <SelectItem key={track.id} value={track.id} className="hover:bg-primary/10">
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-accent" />
                      <Label className="text-sm font-semibold text-foreground">
                        Reminder Times
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addCustomReminder}
                      className="h-8 px-3 hover:bg-primary/10 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-32 overflow-y-auto bg-background/20 rounded-lg p-3 border border-border/20">
                    {reminders.map((reminder, index) => (
                      <div key={index} className="flex items-center gap-2 bg-background/50 p-2 rounded-lg">
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
                          className="w-16 h-8 bg-transparent border-border/30"
                          min="1"
                        />
                        <Select
                          value={reminder.unit}
                          onValueChange={(value) => updateReminder(index, 'unit', value)}
                        >
                          <SelectTrigger className="w-20 h-8 bg-transparent border-border/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card/95 border-border/30">
                            <SelectItem value="minutes">min</SelectItem>
                            <SelectItem value="hours">hrs</SelectItem>
                            <SelectItem value="days">days</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-xs text-muted-foreground font-medium">before</span>
                        {reminders.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeReminder(index)}
                            className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setEventOpen(false)}
                    className="flex-1 bg-background/50 border-border/30 hover:bg-background/70"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveEventAlarm}
                    disabled={!selectedDate || !eventMessage}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Save Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};