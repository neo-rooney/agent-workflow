"use client";

import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateGoogleFormScript } from "@/features/trigger/components/google-form-trigger/utils";

interface GoogleFormTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({
  open,
  onOpenChange,
}: GoogleFormTriggerDialogProps) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("웹훅 URL이 클립보드에 복사되었습니다");
    } catch {
      toast.error("웹훅 URL 복사에 실패했습니다");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Form 설정</DialogTitle>
          <DialogDescription>
            이 웹훅 URL을 Google Form의 Apps Script에서 사용하여 폼이 제출될 때
            이 워크플로우를 트리거합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">웹훅 URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                onClick={copyToClipboard}
                size="icon"
                variant="outline"
                type="button"
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="text-sm font-medium">설정 방법:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Google Form 열기</li>
              <li>점 세 개 메뉴 클릭 → Apps Script 메뉴 클릭</li>
              <li>아래 스크립트를 복사하여 &quot;Code.gs&quot;에 붙여넣기</li>
              <li>
                &quot;Code.gs&quot;의 29번째 줄 &quot;WEBHOOK_URL&quot;을 웹훅
                URL로 교체
              </li>
              <li>
                저장 후 좌측 메뉴의 &quot;트리거&quot; → &quot;트리거
                추가&quot;를 클릭
              </li>
              <li>
                이벤트 소스 선택: &quot;설문지에서&quot; → 이벤트 유형 선택:
                &quot;양식 제출 시&quot; → 저장
              </li>
            </ol>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h4 className="text-sm font-medium">Google App Script:</h4>
            <Button
              variant="outline"
              type="button"
              onClick={async () => {
                const script = generateGoogleFormScript(webhookUrl);
                try {
                  await navigator.clipboard.writeText(script);
                  toast.success(
                    "Google App Script가 클립보드에 복사되었습니다"
                  );
                } catch {
                  toast.error("Google App Script 복사에 실패했습니다");
                }
              }}
            >
              <CopyIcon className="size-4 mr-2" />
              Google App Script 복사
            </Button>
            <p className="text-xs text-muted-foreground">
              이 스크립트는 웹훅 URL을 포함하며 폼 제출을 처리합니다
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="text-sm font-medium">사용 가능한 변수</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.respondentEmail}}"}
                </code>
                - 응답자 이메일
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.responses['Question Name']}}"}
                </code>
                - 특정 답변
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json googleForm.responses}}"}
                </code>
                - 모든 답변을 JSON 객체로
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
