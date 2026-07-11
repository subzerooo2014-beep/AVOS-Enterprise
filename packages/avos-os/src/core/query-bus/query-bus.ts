import { AvosLogger } from "../../foundation/logger/avos-logger";
import { AvosError } from "../../foundation/errors/avos-error";
import { AvosQuery } from "./query";
import { AvosQueryHandler } from "./query-handler";

export class AvosQueryBus {

  private readonly handlers: AvosQueryHandler[] = [];
  private readonly logger = new AvosLogger("QueryBus");

  register(handler: AvosQueryHandler) {
    this.handlers.push(handler);
  }

  async execute(query: AvosQuery) {

    if (!query.type) {
      throw new AvosError("Query type is required","QUERY_TYPE_REQUIRED");
    }

    const handler = this.handlers.find(h => h.supports(query));

    if (!handler) {
      this.logger.warn("No Query Handler", query.type);

      return {
        status:"skipped",
        reason:"NO_HANDLER",
        queryType:query.type
      };
    }

    this.logger.info("Executing Query",query.type);

    return {
      status:"success",
      data:await handler.handle(query)
    };

  }

}
