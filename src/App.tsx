import { Container } from "@mui/material";
import RichText from "./RichTextEditor";
import { exampleItem } from "./RichTextEditor/RichTextExampleItem";

export default function App() {
  return (
    <Container>
      <RichText initialConfigs={exampleItem} />
    </Container>
  );
}
