import { Injectable } from "@nestjs/common";
import { openai } from "../../openai/openai.client";
import { ChatRequest } from "../../shared/chat-request";

@Injectable()
export class OpenAIChatService {

  async chat(req: ChatRequest) {

    const response = await openai.responses.create({
      model: req.model,
      input: [
        {
          role: "system",
          content: req.system,
        },
        {
          role: "user",
          content: req.prompt,
        },
      ],
    });

    return response;
  }
}
