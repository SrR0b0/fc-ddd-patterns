import CustomerAddressChangedEvent from "../customer-address-changed.event";
import EnviaConsoleLogHandler from "./envia-console-log.handler";

describe("EnviaConsoleLogHandler", () => {
  const eventData = {
    id: '1',
    nome: 'xpto',
    endereco: 'esquina do universo',
  };

  describe("constructor", () => {
    let handler: EnviaConsoleLogHandler;

    beforeAll(() => {
      handler = new EnviaConsoleLogHandler();
    });

    it("should be defined", () => {
      expect(handler).toBeDefined();
    });

    it("should implement the EventHandlerInterface", () => {
      expect(handler).toHaveProperty('handle');
      expect(typeof handler.handle).toBe('function');
      expect(handler.handle(new CustomerAddressChangedEvent(eventData))).toBeUndefined();
    });
  });

  describe("handle", () => {
    let handler: EnviaConsoleLogHandler;

    beforeAll(() => {
      handler = new EnviaConsoleLogHandler();
    });

    it("should call console log when a customer's address is changed", () => {
      const logSpy = jest.spyOn(console, 'log');
      const { id, nome, endereco } = eventData;

      handler.handle(new CustomerAddressChangedEvent(eventData));

      expect(logSpy).toHaveBeenCalledWith(`Endereço do cliente: ${id}, ${nome} alterado para: ${endereco}`);
    });
  });
});