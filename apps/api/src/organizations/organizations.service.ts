import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any).organization.findMany({
      include: { branches: true },
    });
  }

  async findOne(id: string) {
    const org = await (this.prisma as any).organization.findUnique({
      where: { id },
      include: { branches: true },
    });

    if (!org) throw new NotFoundException("Organization not found");
    return org;
  }

  create(dto: CreateOrganizationDto) {
    return (this.prisma as any).organization.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    await this.findOne(id);

    return (this.prisma as any).organization.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await (this.prisma as any).organization.delete({
      where: { id },
    });

    return { deleted: true };
  }
}
