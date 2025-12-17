export const getAuthErrorMessage = (error: {
  message: string;
  code?: string;
}) => {
  const errorMessage = error.message.toLowerCase();
  const errorCode = error.code?.toLowerCase();

  // 에러 코드 기반 매핑
  if (errorCode) {
    const codeMap: Record<string, string> = {
      invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
      user_not_found: "등록되지 않은 이메일입니다.",
      invalid_password: "비밀번호가 올바르지 않습니다.",
      email_already_exists: "이미 사용 중인 이메일입니다.",
      invalid_email: "이메일 형식이 올바르지 않습니다.",
    };

    if (codeMap[errorCode]) {
      return codeMap[errorCode];
    }
  }

  // 메시지 내용 기반 매핑 (fallback)
  if (
    errorMessage.includes("invalid email") ||
    errorMessage.includes("invalid password")
  ) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }

  if (errorMessage.includes("user not found")) {
    return "등록되지 않은 이메일입니다.";
  }

  if (errorMessage.includes("email already exists")) {
    return "이미 사용 중인 이메일입니다.";
  }

  // 기본값: 원본 메시지 반환 또는 기본 한글 메시지
  return "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
};
