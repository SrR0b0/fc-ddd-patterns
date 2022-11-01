import OrderItem from "./order_item";

export enum OrderStatus {
  PENDING_PAYMENT,
  PAYMENT_CONFIRMED,
  SHIPPED,
  COMPLETED,
  CANCELLED = -1,
}

export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;
  private _status: OrderStatus

  constructor(id: string, customerId: string, items: OrderItem[], status?: OrderStatus) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.total();
    this._status = status ?? OrderStatus.PENDING_PAYMENT;
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get status(): OrderStatus {
    return this._status;
  }

  validate(): boolean {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._customerId.length === 0) {
      throw new Error("CustomerId is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }

    return true;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
  }

  pendingPayment(): boolean {
    return this._status === OrderStatus.PENDING_PAYMENT;
  }

  confirmPayment(): void {
    if (this.cancelled()) {
      throw new Error("Order cancelled");
    }
    if (!this.pendingPayment()) {
      throw new Error("Only orders with pending payment can have payment confirmed");
    }
    this._status = OrderStatus.PAYMENT_CONFIRMED;
  }

  paymentConfirmed(): boolean {
    return this._status >= OrderStatus.PAYMENT_CONFIRMED;
  }

  ship(): void {
    if (this.cancelled()) {
      throw new Error("Order cancelled");
    }
    if (!this.paymentConfirmed()) {
      throw new Error("Order must have payment confirmed to be shipped");
    }
    if (this.shipped()) {
      throw new Error("Order already shipped");
    }
    this._status = OrderStatus.SHIPPED;
  }

  shipped(): boolean {
    return this._status >= OrderStatus.SHIPPED;
  }

  complete(): void {
    if (this.cancelled()) {
      throw new Error("Order cancelled");
    }
    if (!this.shipped()) {
      throw new Error("Order must be shipped before completed");
    }
    this._status = OrderStatus.COMPLETED;
  }

  completed(): boolean {
    return this._status === OrderStatus.COMPLETED;
  }

  cancel(): void {
    if (this.paymentConfirmed()) {
      throw new Error("Cannot cancel order after it has been paid");
    }
    this._status = OrderStatus.CANCELLED;
  }

  cancelled(): boolean {
    return this._status === OrderStatus.CANCELLED;
  }
}
