import CustomerAddressChangedEvent from "./customer-address-changed.event";

const MOCK_DATE = new Date();
class MockDate extends Date {
  constructor() {
    super(MOCK_DATE);
  }
}

describe("CustomerAddressChangedEvent", () => {
  describe("constructor", () => {
    const realDate = Date;
    let event: CustomerAddressChangedEvent;
    const eventData = {
      id: '1',
      nome: 'xpto',
      endereco: 'esquina do universo',
    };

    beforeAll(() => {
      const _GLOBAL: any = global;
      _GLOBAL.Date = MockDate;

      event = new CustomerAddressChangedEvent(eventData);
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
        eventData,
      });
    });
  });
});
