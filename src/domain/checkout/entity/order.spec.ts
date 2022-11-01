import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrowError("CustomerId is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);

    let total = order.total();

    expect(order.total()).toBe(200);
    expect(item.price).toBe(100)
    expect(item2.price).toBe(200)

    const order2 = new Order("o1", "c1", [item, item2]);
    total = order2.total();
    expect(total).toBe(600);
  });

  it("should throw error if the item qte is less or equal zero 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Quantity must be greater than 0");
  });

  it("should be create with pendind payment status", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
    const order = new Order("o1", "c1", [item]);

    expect(order.pendingPayment()).toBe(true);
  });

  describe("confirmPayment", () => {
    it("should confirm payment", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);

      order.confirmPayment();
    
      expect(order.paymentConfirmed()).toBe(true);
    })

    it("should throw error when trying to confirm payment of an order with payment confirmed", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);

      order.confirmPayment();
    
      expect(() => order.confirmPayment())
        .toThrowError("Only orders with pending payment can have payment confirmed");
    });

    it("should throw error when trying to confirm payment of a already shipped order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);

      order.confirmPayment();
      order.ship();
    
      expect(() => order.confirmPayment())
        .toThrowError("Only orders with pending payment can have payment confirmed");
    });

    it("should throw error when trying to confirm payment of a completed order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);

      order.confirmPayment();
      order.ship();
      order.complete();
    
      expect(() => order.confirmPayment())
        .toThrowError("Only orders with pending payment can have payment confirmed");
    });

    it("should throw error when trying to confirm payment of a cancelled order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);

      order.cancel();
    
      expect(() => order.confirmPayment())
        .toThrowError("Order cancelled");
    });
  });

  describe("ship", () => {
    it("should ship paid order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
  
      order.confirmPayment();
      order.ship();
    
      expect(order.shipped()).toBe(true);  
    });

    it("should throw error when trying to ship order without payment confirmation", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      expect(() => order.ship())
        .toThrowError("Order must have payment confirmed to be shipped");
    });

    it("should throw error when trying to ship an order already shipped", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      order.confirmPayment();
      order.ship();

      expect(() => order.ship())
        .toThrowError("Order already shipped");
    });

    it("should throw error when trying to ship a completed order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      order.confirmPayment();
      order.ship();
      order.complete();

      expect(() => order.ship())
        .toThrowError("Order already shipped");
    });

    it("should throw error when trying to ship a cancelled order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      order.cancel();

      expect(() => order.ship())
        .toThrowError("Order cancelled");
    });

  });

  describe("complete", () => {
    it("should complete shipped order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      order.confirmPayment();
      order.ship();
      order.complete();

      expect(order.completed()).toBe(true);
    });

    it("should throw error when trying to complete order without payment confirmation", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      expect(() => order.complete())
        .toThrowError("Order must be shipped before completed");
    });

    it("should throw error when trying to complete cancelled order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      order.cancel();

      expect(() => order.complete())
        .toThrowError("Order cancelled");
    });
  });


  describe("cancel", () => {
    it("should complete order with pending payment", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      order.cancel();

      expect(order.cancelled()).toBe(true);
    });

    it("should throw error when trying to cancel a paid order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      order.confirmPayment();

      expect(() => order.cancel())
        .toThrowError("Cannot cancel order after it has been paid");
    });

    it("should throw error when trying to cancel a shipped order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      order.confirmPayment();
      order.ship();

      expect(() => order.cancel())
        .toThrowError("Cannot cancel order after it has been paid");
    });

    it("should throw error when trying to cancel a completed order", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
      const order = new Order("o1", "c1", [item]);
    
      order.confirmPayment();
      order.ship();
      order.complete();

      expect(() => order.cancel())
        .toThrowError("Cannot cancel order after it has been paid");
    });
  });
});
