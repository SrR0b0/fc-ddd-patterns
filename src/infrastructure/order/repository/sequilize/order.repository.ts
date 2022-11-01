import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderFactory from "../../../../domain/checkout/factory/order.factory";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        status: entity.status,
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const model = await OrderModel.findOne({ where: { id: entity.id }, include: ["items"] });
    await model.set('status', entity.status).save();
  }

  async find(id: string): Promise<Order> {
    const model = await OrderModel.findByPk(id, { include: ["items"] });
    return this.buildOrder(model);
  }

  async findAll(): Promise<Order[]> {
    const models = await OrderModel.findAll({ include: ["items"] });
    return models.map((model) => this.buildOrder(model));
  }

  private buildOrder(model: OrderModel): Order {
    return OrderFactory.create({
      id: model.id,
      customerId: model.customer_id,
      status: model.status,
      items: model.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.product_id,
        quantity: item.quantity,
      })),
    },);
  }
}
