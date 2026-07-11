"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kernel_1 = require("../kernel");
const kernel = new kernel_1.AvosKernelService();
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
