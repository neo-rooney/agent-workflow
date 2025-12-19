"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma/enums";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MAMUAL_TRIGGER,
    label: "Trigger Manually",
    description:
      "워크플로우를 수동으로 실행하는 노드입니다. 해당 노드가 존재하는 경우 워크플로우 실행 버튼이 에디터에 표시됩니다.",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form Trigger",
    description:
      "구글 폼 제출 시 워크플로우를 실행하는 노드입니다. 빠르게 시작하기 좋습니다.",
    icon: "/logos/google-form.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description:
      "URL에 요청을 보내는 노드입니다. 웹 서비스에 요청을 보낼 때 사용합니다.",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MAMUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MAMUAL_TRIGGER
        );
        if (hasManualTrigger) {
          toast.error("하나의 트리거 노드만 허용됩니다.");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitialNode = nodes.some(
          (node) => node.type === NodeType.INITIAL
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          type: selection.type,
          position: flowPosition,
          data: {},
        };

        if (hasInitialNode) {
          return [newNode];
        }

        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [getNodes, setNodes, onOpenChange, screenToFlowPosition]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>트리거 노드를 선택하세요.</SheetTitle>
          <SheetDescription>
            트리거 노드는 흐름을 시작하는 노드입니다.
          </SheetDescription>
        </SheetHeader>
        {triggerNodes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <div
              key={nodeType.type}
              className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
              onClick={() => handleNodeSelect(nodeType)}
            >
              <div className="flex items-center gap-6 w-full overflow-hidden">
                {typeof Icon === "string" ? (
                  <Image
                    src={Icon}
                    alt={nodeType.label}
                    className="size-5 object-contain rounded-sm"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Icon className="size-5" />
                )}
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{nodeType.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {nodeType.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <Separator />
        <SheetHeader>
          <SheetTitle>실행 노드를 선택하세요.</SheetTitle>
          <SheetDescription>
            실행 노드는 흐름을 실행하는 노드입니다.
          </SheetDescription>
        </SheetHeader>
        {executionNodes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <div
              key={nodeType.type}
              className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
              onClick={() => handleNodeSelect(nodeType)}
            >
              <div className="flex items-center gap-6 w-full overflow-hidden">
                {typeof Icon === "string" ? (
                  <Image
                    src={Icon}
                    alt={nodeType.label}
                    className="size-5 object-contain rounded-sm"
                    width={20}
                    height={20}
                  />
                ) : (
                  <Icon className="size-5" />
                )}
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{nodeType.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {nodeType.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </SheetContent>
    </Sheet>
  );
}
