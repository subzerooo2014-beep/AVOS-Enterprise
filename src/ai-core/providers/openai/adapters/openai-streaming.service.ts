import { Injectable } from "@nestjs/common";
import { openai } from "../../openai/openai.client";

@Injectable()
export class OpenAIStreamingService {

  async stream(model: string, system: string, prompt: string) {

    return openai.responses.create({
      model,
      stream: true,
      input: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  }

}
