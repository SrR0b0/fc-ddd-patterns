import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreated from "../customer-created.event";

export default class EnviaConsoleLog2Handler implements EventHandlerInterface {
  handle(event: CustomerCreated) {
    console.log("Esse é o segundo console.log do evento: CustomerCreated")
  }
}
