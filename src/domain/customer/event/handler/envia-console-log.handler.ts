import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChanged from "../customer-address-changed.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface {
  handle(event: CustomerAddressChanged) {
    const { id, nome, endereco } = event.eventData;
    console.log(`Endereço do cliente: ${id}, ${nome} alterado para: ${endereco}`)
  }
}
