import { Module } from "@nestjs/common";
import { SymbolTableService } from "./symbol-table.service";
import { SymbolTableController } from "./symbol-table.controller";

@Module({
  providers:[SymbolTableService],
  controllers:[SymbolTableController],
  exports:[SymbolTableService]
})
export class SymbolTableModule {}
