import { ContainerCard, TitleCard } from "./styles";

const Card = ({ title, minHeightProp, maxHeightProp, children }: { title: string; minHeightProp?: string; maxHeightProp?: string; children?: React.ReactNode }) => {
  return (
    <ContainerCard $minHeightProp={minHeightProp} $maxHeightProp={maxHeightProp}>
      <TitleCard>{title}</TitleCard>

      {children}
    </ContainerCard>
  );
};

export default Card;
