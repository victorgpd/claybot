import { ContainerCard, TitleCard } from "./styles";

const Card = ({ title, minHeightProp, children }: { title: string; minHeightProp?: string; children?: React.ReactNode }) => {
  return (
    <ContainerCard $minHeightProp={minHeightProp}>
      <TitleCard>{title}</TitleCard>

      {children}
    </ContainerCard>
  );
};

export default Card;
