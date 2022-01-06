import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { useTable } from "react-table";

type FormType = {
  networkAddressBlock: string;
  subnetMask: string;
  numberOfHosts: string;
  numberOfSubnets: string;
};

function App() {
  const [data, setData] = useState<any[]>([]);
  const { register, handleSubmit } = useForm<FormType>();

  function onSubmit(data: any) {
    fetch("http://localhost:3001/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("server Data is ", data);
        setData(data);
      });
  }

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Subnet Address",
        accessor: "subnetAddress",
      },
      {
        Header: "Host Address Range",
        accessor: "hostAddressRange",
      },
      {
        Header: "Broadcast Address",
        accessor: "broadcastAddress",
      },
    ],
    []
  );

  return (
    <Container>
      <header>
        <h1>Subnet Detail Calculator</h1>
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
      </Wrapper>
      <TableStyles>
        <Table columns={columns} data={[]} />
      </TableStyles>
    </Container>
  );
}

type TableProps = {
  columns: any;
  data: any;
};

function Table({ columns, data }: TableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
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

const TableStyles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;
export default App;
