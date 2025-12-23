"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { CredentialType } from "@/generated/prisma/enums";
import {
  useCreateCredential,
  useSuspenseCredential,
  useUpdateCredential,
} from "@/features/credential/hooks/use-credentials";

const formSchema = z.object({
  name: z.string().min(1, "이름은 필수 입력 사항입니다."),
  type: z.enum(CredentialType),
  value: z.string().min(1, "값은 필수 입력 사항입니다."),
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
  initialData?: FormValues & { id?: string };
}

const credentialTypeOptions = [
  {
    label: "OpenAI",
    value: CredentialType.OPENAI,
    logo: "/logos/openai.svg",
  },
  {
    label: "Anthropic",
    value: CredentialType.ANTHROPIC,
    logo: "/logos/anthropic.svg",
  },
  { label: "Gemini", value: CredentialType.GEMINI, logo: "/logos/gemini.svg" },
];

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateCredential.mutateAsync(
        { id: initialData.id, ...values },
        {
          onSuccess: () => {
            router.push(`/credentials/${initialData.id}`);
          },
        }
      );
    } else {
      await createCredential.mutateAsync(values, {
        onSuccess: (data) => {
          router.push(`/credentials/${data.id}`);
        },
      });
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{isEdit ? "인증 정보 수정" : "인증 정보 생성"}</CardTitle>
        <CardDescription>
          {isEdit ? "인증 정보를 수정해주세요." : "인증 정보를 생성해주세요."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>인증 정보 이름</FormLabel>
                  <FormControl>
                    <Input placeholder="My API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>인증 정보 타입</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentialTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={option.logo}
                              alt={option.label}
                              width={16}
                              height={16}
                            />
                            {option.label}
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>인증 정보 값</FormLabel>
                  <FormControl>
                    <Input placeholder="sk-..." {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={
                  createCredential.isPending || updateCredential.isPending
                }
              >
                {isEdit ? "수정" : "생성"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/credentials">취소</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);
  return <CredentialForm initialData={credential} />;
};
