import toposort from "toposort";
import type { Connection, Node } from "@/generated/prisma/client";
import { inngest } from "@/inngest/client";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  // 1.초기 검증: 연결이 없으면 입력 노드 배열을 그대로 반환
  if (connections.length === 0) {
    return nodes;
  }

  // 2. 간선 변환: 연결 정보(`connections`)를 [출발, 도착] 형태의 간선 배열로 변환
  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  // 3. 연결 노드 추출: 모든 연결에 포함된 노드 ID를 Set에 수집
  const connectedNodes = new Set<string>();
  for (const connection of connections) {
    connectedNodes.add(connection.fromNodeId);
    connectedNodes.add(connection.toNodeId);
  }

  // 4. 독립 노드 처리: 연결되지 않은 노드는 자기 자신으로의 간선을 추가
  for (const node of nodes) {
    if (!connectedNodes.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // 5. 위상 정렬: toposort로 의존성 순서 결정, 순환 참조 시 에러 처리
  let sortedNodeIds: string[] = [];
  try {
    sortedNodeIds = toposort(edges); // 간선 정보를 분석해 의존성 순서를 결정, 예: ["A", "B"]는 "A가 B보다 먼저"를 의미
    sortedNodeIds = [...new Set(sortedNodeIds)]; // toposort 결과에 중복이 생길 수 있으므로 중복을 제거 후 배열로 변환
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }
    throw error;
  }
  // 6. 노드 맵 생성: ID를 키로 하는 노드 맵 생성
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  // 7. 결과 구성: 정렬된 ID 순서대로 노드를 조회해 배열로 반환
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  [key: string]: unknown;
}) => {
  await inngest.send({
    name: "workflows/execute.workflow",
    data,
  });
};
