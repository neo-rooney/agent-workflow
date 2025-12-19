import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/configs/executors";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import type { AnthropicFormValues } from "@/features/execution/components/anthropic/dialog";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export const anthropicExecutor: NodeExecutor<AnthropicFormValues> = async ({
  nodeId,
  context,
  step,
  data,
  publish,
}) => {
  await publish(
    anthropicChannel().status({
      nodeId,
      status: "loading",
    })
  );
  if (!data.variableName) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError(
      "Anthropic node: 변수 이름이 설정되지 않았습니다."
    );
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";

  if (!data.userPrompt) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError(
      "Anthropic node: 사용자 프롬프트가 설정되지 않았습니다."
    );
  }
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  try {
    //TODO: 키값 유저입력으로 추후 변경
    const credentialValue = process.env.ANTHROPIC_API_KEY;

    const anthropic = createAnthropic({
      apiKey: credentialValue,
    });

    const { steps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: anthropic(data.model || ""),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      anthropicChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};

