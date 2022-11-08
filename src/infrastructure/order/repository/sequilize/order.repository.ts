import { Sequelize } from "sequelize-typescript";
import { Optional } from "sequelize/types";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderFactory from "../../../../domain/checkout/factory/order.factory";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  constructor(private sequelize: Sequelize) {}

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      entity.toJSON(),
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const model = await OrderModel.findOne({ where: { id: entity.id }, include: ["items"] });
    const transaction = await this.sequelize.transaction();
    try {
      model.set('status', entity.status);
      const promises: Promise<any>[] = [model.save({ transaction })];
      for (let item of entity.toJSON().items) {
        promises.push(OrderItemModel.upsert(item, { transaction }));
      }
      await Promise.all(promises);
    } catch (e) {
      console.debug(e);
      await transaction.rollback();
      throw e;
    }
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
    });
  }
}
