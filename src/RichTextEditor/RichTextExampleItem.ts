export const exampleItem = {
  title: "Horários para o agendamento",
  description: "Pergunta de horários para o agendamento.",
  key: "ASK_DESIRED_TIME",
  defaultMessage:
    "Ótimo! Encontrei alguns horários disponíveis no dia *###ARG_1*:\n\n ###OPTIONS\nSelecione o horário desejado informando o número correspondente ou digite uma nova data (Ex.: *###ARG_2*) para verificarmos a disponibilidade.",
  fields: [
    {
      field: "ARG_1",
      name: "Primeiro argumento",
    },
    {
      field: "OPTIONS",
      name: "Opções",
    },
    {
      field: "ARG_2",
      name: "Segundo argumento",
    },
  ],
  relatedMessages: [
    {
      key: "INTERACTIVE_ASK_DESIRED_TIME",
      unusedFields: ["OPTIONS"],
    },
  ],
  message: "",
};
