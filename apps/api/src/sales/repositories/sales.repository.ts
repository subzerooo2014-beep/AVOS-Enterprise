import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ISalesRepository } from '../interfaces/i-sales.repository';

@Injectable()
export class SalesRepository implements ISalesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(): any {
    const client = this.prisma as any;

    if (!client.sale) {
      throw new BadRequestException("Prisma delegate 'sale' is not available. Run pnpm prisma generate.");
    }

    return client.sale;
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
