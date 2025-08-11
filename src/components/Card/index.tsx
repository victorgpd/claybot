import { ContainerCard, TitleCard } from "./styles";

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <ContainerCard>
      <TitleCard>{title}</TitleCard>

      {children}
    </ContainerCard>
  );
};

export default Card;
