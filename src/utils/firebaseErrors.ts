const firebaseErrorMessages: Record<string, string> = {
  "auth/email-already-in-use": "Este e-mail já está em uso.",
  "auth/invalid-email": "O e-mail informado não é válido.",
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
  "auth/invalid-verification-code": "Código de verificação inválido.",
  "auth/invalid-phone-number": "Número de telefone inválido.",
  "auth/missing-phone-number": "Número de telefone ausente.",
  "auth/invalid-credential": "Email ou senha inválidos.",
};

export const getFirebaseErrorMessage = (errorCode: string): string => {
  return firebaseErrorMessages[errorCode] || "Ocorreu um erro. Tente novamente.";
};
