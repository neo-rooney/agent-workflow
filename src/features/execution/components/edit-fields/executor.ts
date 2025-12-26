import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/configs/executors";
import { editFieldsChannel } from "@/inngest/channels/edit-fields";

export interface EditFieldsFormValues {
  fields: Array<{
    name: string;
    type: "string" | "number" | "boolean" | "object" | "array";
    value: unknown;
  }>;
}

export const editFieldsExecutor: NodeExecutor<EditFieldsFormValues> = async ({
  nodeId,
  context,
  step,
  data,
  publish,
}) => {
  await publish(
    editFieldsChannel().status({
      nodeId,
      status: "loading",
    })
  );

  try {
    if (!data.fields || !Array.isArray(data.fields)) {
      await publish(
        editFieldsChannel().status({
          nodeId,
          status: "error",
        })
      );
      throw new NonRetriableError(
        "EditFields node: 필드 배열이 올바르지 않습니다."
      );
    }

    // 필드들을 context에 추가
    const newContext = { ...context };

    for (const field of data.fields) {
      if (!field.name) {
        await publish(
          editFieldsChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError(
          `EditFields node: 필드 이름이 설정되지 않았습니다.`
        );
      }

      // 변수명 검증 (영문자, 숫자, 언더스코어만 허용)
      if (!/^[a-zA-Z_$][A-Za-z0-9_$]*$/.test(field.name)) {
        await publish(
          editFieldsChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError(
          `EditFields node: 필드 이름 "${field.name}"이 유효하지 않습니다. 영문자, 숫자, 언더스코어만 사용할 수 있습니다.`
        );
      }

      // 타입별 값 변환
      let value = field.value;

      try {
        if (field.type === "object" || field.type === "array") {
          // object/array 타입은 JSON 문자열로 저장되어 있을 수 있음
          if (typeof field.value === "string") {
            value = JSON.parse(field.value);
          } else {
            value = field.value;
          }
        } else if (field.type === "number") {
          const numValue = Number(field.value);
          if (isNaN(numValue)) {
            throw new Error("숫자 형식이 올바르지 않습니다.");
          }
          value = numValue;
        } else if (field.type === "boolean") {
          // 문자열 "true"/"false" 또는 boolean 값 처리
          if (typeof field.value === "string") {
            value = field.value.toLowerCase() === "true";
          } else {
            value = Boolean(field.value);
          }
        } else if (field.type === "string") {
          value = String(field.value);
        }

        // context에 필드 추가 (중복 시 마지막 값 사용)
        newContext[field.name] = value;
      } catch (error) {
        await publish(
          editFieldsChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError(
          `EditFields node: 필드 "${
            field.name
          }"의 값 변환 중 오류가 발생했습니다: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    await publish(
      editFieldsChannel().status({
        nodeId,
        status: "success",
      })
    );

    return newContext;
  } catch (error) {
    await publish(
      editFieldsChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
