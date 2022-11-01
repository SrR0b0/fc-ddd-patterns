import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog2Handler from "./envia-console-log-2.handler";

describe("EnviaConsoleLog2Handler", () => {
  describe("constructor", () => {
    let handler: EnviaConsoleLog2Handler;

    beforeAll(() => {
      handler = new EnviaConsoleLog2Handler();
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
    let handler: EnviaConsoleLog2Handler;

    beforeAll(() => {
      handler = new EnviaConsoleLog2Handler();
    });

    it("should call console log when a customer's address is changed", () => {
      const logSpy = jest.spyOn(console, 'log');

      handler.handle(new CustomerCreatedEvent());

      expect(logSpy).toHaveBeenCalledWith("Esse é o segundo console.log do evento: CustomerCreated");
    });
  });
});