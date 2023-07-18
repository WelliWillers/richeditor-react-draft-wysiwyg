import { TagProps } from "@/types";

export function convertVariablesToHashtagVariable(
  markDownText: string,
  variables: TagProps[]
) {
  let novoTexto = markDownText;

  variables.forEach((item) => {
    const variavel = `###${item.field}`;
    const valor = `#${item.name}#`;
    novoTexto = novoTexto.replace(variavel, valor);
  });

  return novoTexto;
}
