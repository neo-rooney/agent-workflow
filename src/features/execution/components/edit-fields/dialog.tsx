"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface EditFieldsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<EditFieldsFormValues>;
}

const fieldSchema = z.object({
  name: z
    .string()
    .min(1, { message: "필드 이름은 필수 입력 항목입니다." })
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "필드 이름은 영문자, 숫자, 언더스코어로 시작해야 합니다.",
    }),
  type: z.enum(["string", "number", "boolean", "object", "array"]),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({}),
    z.array(z.unknown()),
  ]),
});

const formSchema = z.object({
  fields: z
    .array(fieldSchema)
    .min(1, { message: "최소 하나의 필드가 필요합니다." }),
});

export type EditFieldsFormValues = z.infer<typeof formSchema>;

export const EditFieldsDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: EditFieldsDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: defaultValues.fields ?? [{ name: "", type: "string", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // 타입별 값 변환
    const processedFields = values.fields.map((field) => {
      let processedValue:
        | string
        | number
        | boolean
        | unknown[]
        | Record<string, never> = field.value as
        | string
        | number
        | boolean
        | unknown[]
        | Record<string, never>;

      if (field.type === "object" || field.type === "array") {
        // object/array는 JSON 문자열로 저장
        if (typeof field.value === "string") {
          try {
            processedValue = JSON.parse(field.value) as
              | unknown[]
              | Record<string, never>;
          } catch {
            // 파싱 실패 시 원본 문자열 유지
            processedValue = field.value as string;
          }
        } else {
          processedValue = JSON.stringify(field.value) as string;
        }
      } else if (field.type === "number") {
        processedValue = Number(field.value);
      } else if (field.type === "boolean") {
        if (typeof field.value === "string") {
          processedValue = field.value.toLowerCase() === "true";
        } else {
          processedValue = Boolean(field.value);
        }
      } else {
        processedValue = String(field.value);
      }

      return {
        ...field,
        value: processedValue,
      };
    });

    onSubmit({ fields: processedFields });
    onOpenChange(false);
  };

  const addField = () => {
    append({ name: "", type: "string", value: "" });
  };

  const removeField = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        fields: defaultValues.fields ?? [
          { name: "", type: "string", value: "" },
        ],
      });
    }
  }, [open, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Fields 설정</DialogTitle>
          <DialogDescription>
            다음 노드에서 사용할 필드를 정의합니다. 각 필드는 이름, 타입, 값을
            가집니다.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-4 bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">필드 {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>필드 이름</FormLabel>
                          <FormControl>
                            <Input placeholder="input" {...field} />
                          </FormControl>
                          <FormDescription>
                            다른 노드에서 사용할 변수 이름
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`fields.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>타입</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="타입 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="object">Object</SelectItem>
                              <SelectItem value="array">Array</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`fields.${index}.value`}
                    render={({ field }) => {
                      const fieldType = form.watch(`fields.${index}.type`);
                      const currentValue = form.watch(`fields.${index}.value`);

                      return (
                        <FormItem>
                          <FormLabel>값</FormLabel>
                          <FormControl>
                            {fieldType === "boolean" ? (
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(value === "true")
                                }
                                defaultValue={
                                  typeof currentValue === "boolean"
                                    ? currentValue.toString()
                                    : String(currentValue || "false")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">True</SelectItem>
                                  <SelectItem value="false">False</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : fieldType === "object" ||
                              fieldType === "array" ? (
                              <Textarea
                                {...field}
                                value={
                                  typeof currentValue === "string"
                                    ? currentValue
                                    : JSON.stringify(currentValue, null, 2)
                                }
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                                className="min-h-[120px] font-mono text-sm"
                                placeholder={
                                  fieldType === "object"
                                    ? '{"key": "value"}'
                                    : '["item1", "item2"]'
                                }
                              />
                            ) : fieldType === "number" ? (
                              <Input
                                {...field}
                                type="number"
                                value={
                                  typeof currentValue === "number"
                                    ? currentValue
                                    : typeof currentValue === "string"
                                    ? currentValue
                                    : ""
                                }
                                onChange={(e) => {
                                  const numValue = e.target.value
                                    ? Number(e.target.value)
                                    : "";
                                  field.onChange(
                                    numValue === "" ? "" : numValue
                                  );
                                }}
                                placeholder="123"
                              />
                            ) : (
                              <Input
                                {...field}
                                value={String(currentValue || "")}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="오늘 서울의 날씨는?"
                              />
                            )}
                          </FormControl>
                          <FormDescription>
                            {fieldType === "object" || fieldType === "array"
                              ? "JSON 형식으로 입력하세요."
                              : fieldType === "number"
                              ? "숫자를 입력하세요."
                              : fieldType === "boolean"
                              ? "True 또는 False를 선택하세요."
                              : "문자열을 입력하세요."}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addField}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              필드 추가
            </Button>

            <DialogFooter className="mt-4">
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
