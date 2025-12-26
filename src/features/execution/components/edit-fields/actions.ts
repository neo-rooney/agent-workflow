"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { editFieldsChannel } from "@/inngest/channels/edit-fields";
import { inngest } from "@/inngest/client";

export type EditFieldsToken = Realtime.Token<
  typeof editFieldsChannel,
  ["status"]
>;

export async function fetchEditFieldsRealtimeToken(): Promise<EditFieldsToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: editFieldsChannel(),
    topics: ["status"],
  });

  return token;
}
