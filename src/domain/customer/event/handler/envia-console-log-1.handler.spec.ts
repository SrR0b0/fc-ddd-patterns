import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog1Handler from "./envia-console-log-1.handler";

describe("EnviaConsoleLog1Handler", () => {
  describe("constructor", () => {
    let handler: EnviaConsoleLog1Handler;

    beforeAll(() => {
      handler = new EnviaConsoleLog1Handler();
    });

    it("should be defined", () => {
      expect(handler).toBeDefined();
    });

    it("should implement the EventHandlerInterface", () => {
      expect(handler).toHaveProperty('handle');
      expect(typeof handler.handle).toBe('function');
      expect(handler.handle(new CustomerCreatedEvent())).toBeUndefined();
    });
  });

  describe("handle", () => {
    let handler: EnviaConsoleLog1Handler;

    beforeAll(() => {
      handler = new EnviaConsoleLog1Handler();
    });

    it("should call console log when a customer's address is changed", () => {
      const logSpy = jest.spyOn(console, 'log');

      handler.handle(new CustomerCreatedEvent());

      expect(logSpy).toHaveBeenCalledWith("Esse é o primeiro console.log do evento: CustomerCreated");
    });
  });
});