import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreated from "../customer-created.event";

export default class EnviaConsoleLog1Handler implements EventHandlerInterface {
  handle(event: CustomerCreated) {
    console.log("Esse é o primeiro console.log do evento: CustomerCreated");
  }
}
