import { Injectable } from "@nestjs/common";
import { openai } from "../../openai/openai.client";
import { ChatRequest } from "../../shared/chat-request";

@Injectable()
export class OpenAIJsonService {
  async json(req: ChatRequest) {
    return openai.responses.create({
      model: req.model,
      input: [
        { role: "system", content: req.system + "\nReturn JSON only." },
        { role: "user", content: req.prompt },
      ],
      text: {
        format: { type: "json_object" },
      },
    } as any);
  }
}
