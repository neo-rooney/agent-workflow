import { createLoader } from "nuqs/server";
import { credentialsParams } from "@/features/credential/utils/params";

export const credentialsParamsLoader = createLoader(credentialsParams);
