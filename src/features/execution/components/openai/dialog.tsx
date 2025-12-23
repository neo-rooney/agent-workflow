"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { AVAILABLE_OPENAI_MODELS } from "@/configs/constants";
import { useCredentialsByType } from "@/features/credential/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import Image from "next/image";
interface OpenAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<OpenAIFormValues>;
}

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "변수 이름은 필수 입력 항목입니다." })
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "변수 이름은 영문자, 숫자, 언더스코어로 시작해야 합니다.",
    }),
  model: z.enum(AVAILABLE_OPENAI_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "사용자 프롬프트는 필수 입력 항목입니다."),
  credentialId: z.string().min(1, "인증 정보는 필수 선택 항목입니다."),
});

export type OpenAIFormValues = z.infer<typeof formSchema>;

export const OpenAIDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: OpenAIDialogProps) => {
  const { data: credentials, isLoading: isLoadingCredentials } =
    useCredentialsByType(CredentialType.OPENAI);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? "",
      model: defaultValues.model ?? AVAILABLE_OPENAI_MODELS[0],
      systemPrompt: defaultValues.systemPrompt ?? "",
      userPrompt: defaultValues.userPrompt ?? "",
      credentialId: defaultValues.credentialId ?? "",
    },
  });

  const watchVariableName = form.watch("variableName") || "MyOpenAI";

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName ?? "",
        model: defaultValues.model ?? AVAILABLE_OPENAI_MODELS[0],
        systemPrompt: defaultValues.systemPrompt ?? "",
        userPrompt: defaultValues.userPrompt ?? "",
        credentialId: defaultValues.credentialId ?? "",
      });
    }
  }, [open, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>OpenAI 설정</DialogTitle>
          <DialogDescription>
            OpenAI 노드에 대한 AI 모델과 프롬프트를 설정합니다.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>변수 이름</FormLabel>
                  <FormControl>
                    <Input placeholder="MyOpenAI" {...field} />
                  </FormControl>

                  <FormDescription>
                    다른 노드에서 사용할 현재 노드의 변수 이름을 입력합니다.{" "}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenAI 인증 정보</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingCredentials || !credentials?.length}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a credential" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentials?.map((credential) => (
                        <SelectItem key={credential.id} value={credential.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/logos/openai.svg"
                              alt="OpenAI"
                              width={16}
                              height={16}
                            />
                            {credential.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>모델</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="모델 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_OPENAI_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    요청에 사용할 OpenAI 모델을 선택합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>시스템 프롬프트(선택)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[80px] font-mono text-sm"
                      placeholder="You are a helpful assistant."
                    />
                  </FormControl>
                  <FormDescription>
                    어시스턴트의 동작을 설정합니다. 간단한 값은{" "}
                    {"{{variables}}"}, 객체는 {"{{json variable}}"} 형식으로
                    사용하세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사용자 프롬프트</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[120px] font-mono text-sm"
                      placeholder={`다음 텍스트를 요약합니다: {{json httpResponse.data}}`}
                    />
                  </FormControl>
                  <FormDescription>
                    어시스턴트에 전송할 프롬프트를 입력합니다. 간단한 값은{" "}
                    {"{{variables}}"}, 객체는 {"{{json variable}}"} 형식으로
                    사용하세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
