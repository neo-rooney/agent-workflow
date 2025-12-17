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

export type HttpRequsetFormValues = z.infer<typeof formSchema>;

interface HttpRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: HttpRequsetFormValues) => void;
  defaultValues?: Partial<HttpRequsetFormValues>;
}

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "변수 이름은 필수 입력 항목입니다." })
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "변수 이름은 영문자, 숫자, 언더스코어로 시작해야 합니다.",
    }),
  endpoint: z.url({ message: "올바른 URL을 입력해주세요." }),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  body: z.string().optional(),
});

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: HttpRequestDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName ?? "",
      endpoint: defaultValues?.endpoint ?? "",
      method: defaultValues?.method ?? "GET",
      body: defaultValues?.body ?? "",
    },
  });

  const watchMethod = form.watch("method");
  const watchVariableName = form.watch("variableName") || "MyApiCall";
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName ?? "",
        endpoint: defaultValues?.endpoint ?? "",
        method: defaultValues?.method ?? "GET",
        body: defaultValues?.body ?? "",
      });
    }
  }, [open, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>HTTP 요청에 대한 설정을 합니다.</DialogDescription>
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
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="MyApiCall" {...field} />
                  </FormControl>
                  <FormDescription>
                    다른 노드에서 사용할 현재 노드의 변수 이름을 입력합니다.{" "}
                    {`{{${watchVariableName}.httpResponse.data}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    요청에 사용할 HTTP 메서드를 선택합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/endpoint/{{httpResponse.data.id}}"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    요청할 URL을 입력합니다.{" "}
                    {"{{prevNodeName.httpResponse.data.id}}"}와 같이 이전 노드
                    실행 결과를 변수로 사용 할 수 있습니다.{" "}
                    {"{{json prevNodeName.httpResponse.data}}"}와 같이 이전 노드
                    실행 결과 전체를 변수로 사용 할 수 있습니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showBodyField && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[120px] font-mono text-sm"
                        placeholder={`{
  "id": "{{httpResponse.data.age}}",
  "name": "{{httpResponse.data.name}}",
  "items": "{{httpResponse.data.items}}",
}`}
                      />
                    </FormControl>
                    <FormDescription>
                      요청 본문을 입력합니다.{" "}
                      {"{{prevNodeName.httpResponse.data.id}}"}와 같이 이전 노드
                      실행 결과를 변수로 사용 할 수 있습니다.{" "}
                      {"{{json prevNodeName.httpResponse.data}}"}와 같이 이전
                      노드 실행 결과 전체를 변수로 사용 할 수 있습니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="mt-4">
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
