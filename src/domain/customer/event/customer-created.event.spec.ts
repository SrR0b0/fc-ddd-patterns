import CustomerCreatedEvent from "./customer-created.event";

const MOCK_DATE = new Date();
class MockDate extends Date {
  constructor() {
    super(MOCK_DATE);
  }
}

describe("CustomerCreatedEvent", () => {
  describe("constructor", () => {
    const realDate = Date;
    let event: CustomerCreatedEvent;

    beforeAll(() => {
      const _GLOBAL: any = global;
      _GLOBAL.Date = MockDate;

      event = new CustomerCreatedEvent();
    });

    afterAll(() => {
      global.Date = realDate;
    })

    it("should be defined", () => {
      expect(event).toBeDefined();
    });

    it("should implement the EventInterface", () => {
      expect(event).toEqual({
        dataTimeOccurred: MOCK_DATE,
        eventData: undefined,
      });
    });
  });
});
