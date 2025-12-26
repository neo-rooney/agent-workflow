import { channel, topic } from "@inngest/realtime";

export const EDIT_FIELDS_CHANNEL_NAME = "edit-fields-execution";

export const editFieldsChannel = channel(EDIT_FIELDS_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
