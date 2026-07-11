import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../prisma/prisma.service";

type Tx = Prisma.TransactionClient;

@Injectable()
export class CancelReservationRepository {

  constructor(
    private readonly prisma:PrismaService
  ){}

  transaction<T>(
    fn:(tx:Tx)=>Promise<T>
  ){
    return this.prisma.$transaction(fn);
  }

  findReservation(
    tx:Tx,
    reservationId:string
  ){

    return tx.reservation.findUnique({

      where:{
        id:reservationId
      },

      include:{
        inventory:{
          include:{
            vehicle:true
          }
        }

      }

    });

  }

  cancelReservation(
    tx:Tx,
    reservationId:string,
    reason?:string
  ){

    return tx.reservation.update({

      where:{
        id:reservationId
      },

      data:{

        status:"CANCELLED",

        notes:reason,

        updatedAt:new Date()

      }

    });

  }

  releaseInventory(
    tx:Tx,
    inventoryId:string
  ){

    return tx.inventory.update({

      where:{
        id:inventoryId
      },

      data:{

        status:"AVAILABLE",

        reserved:false,

        reservedAt:null

      }

    });

  }

  releaseVehicle(
    tx:Tx,
    vehicleId:string
  ){

    return tx.vehicle.update({

      where:{
        id:vehicleId
      },

      data:{
        status:"AVAILABLE"
      }

    });

  }

  createMovement(
    tx:Tx,
    inventoryId:string,
    warehouseId:string|null,
    reservationId:string
  ){

    return tx.stockMovement.create({

      data:{

        inventoryId,

        warehouseId,

        type:"RESERVATION_CANCEL",

        quantity:1,

        reference:reservationId,

        reason:"Reservation cancelled",

        status:"POSTED"

      }

    });

  }

  createAudit(
    tx:Tx,
    reservationId:string
  ){

    return tx.auditLog.create({

      data:{

        action:"RESERVATION_CANCELLED",

        entity:"Reservation",

        entityId:reservationId

      }

    });

  }

}
