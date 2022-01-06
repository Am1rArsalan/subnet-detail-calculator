import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";

type FormType = {
  networkAddressBlock: string;
  subnetMask: string;
  numberOfHosts: string;
  numberOfSubnets: string;
};

function App() {
  const { register, handleSubmit } = useForm<FormType>();

  function onSubmit(data: any) {
    console.log(data);
  }

  return (
    <Container>
      <header>
        <h1>IPv4 Subnet Calculator</h1>
      </header>
      <Wrapper>
        <ContentWrapper onSubmit={handleSubmit(onSubmit)}>
          <ItemWrapper>
            <label htmlFor="name">networkAddressBlock:</label>
            <input type="text" {...register("networkAddressBlock")} />
          </ItemWrapper>
          <ItemWrapper>
            <label htmlFor="subnetMask">subnetMask:</label>
            <input type="text" {...register("subnetMask")} />
          </ItemWrapper>
          <ItemWrapper>
            <label htmlFor="name">networkAddressBlock:</label>
            <input type="text" {...register("numberOfHosts")} />
          </ItemWrapper>
          <ItemWrapper>
            <label htmlFor="name">networkAddressBlock:</label>
            <input type="text" {...register("numberOfSubnets")} />
          </ItemWrapper>
          <button type="submit">Submit</button>
        </ContentWrapper>

        <ContentWrapper>2</ContentWrapper>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  width: 80%;
  height: 80%;
  margin: auto;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ContentWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  width: 100%;
`;

const Wrapper = styled.div`
  background-color: #eee;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
  gap: 20px;
`;

export default App;
