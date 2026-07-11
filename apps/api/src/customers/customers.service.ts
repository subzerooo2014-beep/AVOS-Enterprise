import { Injectable, NotFoundException } from "@nestjs/common";
import { CustomersRepository } from "./repositories/customers.repository";
import { CustomersMapper } from "./mappers/customers.mapper";
import { CustomersSerializer } from "./serializers/customers.serializer";

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async findAll() {
    const items = await this.customersRepository.findCustomers();
    return CustomersSerializer.serializeMany(items);
  }

  async paginate(page = 1, limit = 20, where: any = {}) {
    const result = await this.customersRepository.paginateCustomers(page, limit, where);
    return CustomersSerializer.serializePagination(result);
  }

  async findOne(id: string) {
    const item = await this.customersRepository.findCustomerById(id);
    if (!item) throw new NotFoundException("Customer item not found");
    return CustomersSerializer.serialize(item);
  }

  async create(dto: any) {
    const data = CustomersMapper.toCreate(dto);
    const item = await this.customersRepository.createCustomer(data);
    return CustomersSerializer.serialize(item);
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    const data = CustomersMapper.toUpdate(dto);
    const item = await this.customersRepository.updateCustomer(id, data);
    return CustomersSerializer.serialize(item);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.customersRepository.deleteCustomer(id);
    return { deleted: true };
  }
}
