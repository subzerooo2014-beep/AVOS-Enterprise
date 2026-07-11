import {
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

export class ReservationNotFoundException extends NotFoundException {
  constructor() {
    super("Reservation not found");
  }
}

export class ReservationAlreadyClosedException extends BadRequestException {
  constructor() {
    super("Reservation already closed");
  }
}
