import { AvosKernelService } from "../kernel";

const kernel = new AvosKernelService();

const result = kernel.decide({
  event: "VehicleCreated",
  entityType: "vehicle",
  entityId: "TEST-001",
  payload: {
    make: "Toyota",
    model: "Land Cruiser",
    year: 2024
  }
});

console.log(JSON.stringify(result, null, 2));
