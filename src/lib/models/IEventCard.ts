export interface Property {
  key: string;
  value: any;
}

export interface Image {
  Name: string;
  Path: string;
}
/* Defining the interface for the EventCard object. */
export interface IEventCard {
  EventId: number;
  DeviceName: string;
  EventName: string;
  EventTime: string;
  Properties: Property[];
  Images: Image[];
}
