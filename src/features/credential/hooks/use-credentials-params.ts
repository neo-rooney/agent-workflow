import { useQueryStates } from "nuqs";
import { credentialsParams } from "@/features/credential/utils/params";

export const useCredentialsParams = () => {
  return useQueryStates(credentialsParams);
};
