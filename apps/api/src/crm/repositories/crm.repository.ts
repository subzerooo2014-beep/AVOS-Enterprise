import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ICrmRepository } from "../interfaces/i-crm.repository";

@Injectable()
export class CrmRepository implements ICrmRepository {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(): any {
    const client = this.prisma as any;

    if (!client.crm) {
      throw new BadRequestException("Prisma delegate 'crm' is not available. Add CRM model and run pnpm prisma generate.");
    }

    return client.crm;
  }

  findAll(query: any = {}): Promise<any[]> {
    return this.delegate().findMany(query);
  }

  findOne(id: string): Promise<any> {
    return this.delegate().findUnique({ where: { id } });
  }

  create(data: any): Promise<any> {
    return this.delegate().create({ data });
  }

  update(id: string, data: any): Promise<any> {
    return this.delegate().update({ where: { id }, data });
  }

  delete(id: string): Promise<any> {
    return this.delegate().delete({ where: { id } });
  }

  count(args: any = {}): Promise<number> {
    return this.delegate().count(args);
  }
}
