import EventInterface from "../../@shared/event/event.interface";

export type CustomerAddressChangedEventData = {
  id: string;
  nome: string;
  endereco: string;
};

export default class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: CustomerAddressChangedEventData;

  constructor(eventData: CustomerAddressChangedEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
