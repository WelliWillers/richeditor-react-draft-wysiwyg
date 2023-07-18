export const exampleItem = {
  title: "Agendamento criado ou reagendado com sucesso",
  description: "Mensagem de agendamento criado ou reagendado com sucesso.",
  key: "INFO_SUCCESSFULLY_CREATED_SCHEDULE_WITH_INFO",
  defaultMessage:
    "\n*Agendamento confirmado*\n\nQuando: *###DATA_SELECIONADA* às *###HORARIO_SELECIONADO*\nOnde: *###DESCRICAO_EMPRESA*\n\nA pessoa que lhe atenderá se chama *###CONSULTOR*\n\nProtocolo: *###ID*\nServiço: *###DESCRICAO_SERVICO*\nPlaca: *###PLACA_VEICULO*\n\nPedimos que retire seus pertences pessoais do veículo e leve o manual de garantia.\n",
  fields: [
    {
      field: "DATA_SELECIONADA",
      name: "Data selecionada",
    },
    {
      field: "HORARIO_SELECIONADO",
      name: "Hora selecionada",
    },
    {
      field: "DESCRICAO_EMPRESA",
      name: "Empresa",
    },
    {
      field: "CONSULTOR",
      name: "Consultor",
    },
    {
      field: "ID",
      name: "Número do evento",
    },
    {
      field: "DESCRICAO_SERVICO",
      name: "Serviço",
    },
    {
      field: "PLACA_VEICULO",
      name: "Placa",
    },
  ],
  message: "",
};
