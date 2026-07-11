import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any).branch.findMany({
      include: { organization: true },
    });
  }

  async findOne(id: string) {
    const branch = await (this.prisma as any).branch.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!branch) throw new NotFoundException("Branch not found");
    return branch;
  }

  create(dto: CreateBranchDto) {
    return (this.prisma as any).branch.create({ data: dto });
  }

  async update(id: string, dto: UpdateBranchDto) {
    await this.findOne(id);
    return (this.prisma as any).branch.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await (this.prisma as any).branch.delete({ where: { id } });
    return { deleted: true };
  }
}
