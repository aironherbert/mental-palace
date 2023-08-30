import {
  Box,
  Checkbox,
  Modal,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { NIPES, VALUES } from "../App";
import styled from "@emotion/styled";

const style = {
  boxSizing: "border-box",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  maxWidth: "90vw",
  padding: "10px 0",
};

const CustomTable = styled(Table)`
  & tr td {
    padding: 0;
  }
`;

interface Proptypes {
  onClose: () => void;
  onChoose: (value: string, nipe: string) => void;
}

export default function CardSelection({ onClose, onChoose }: Proptypes) {
  return (
    <Modal open onClose={onClose}>
      <Box sx={style}>
        <h2 style={{ margin: 0, textAlign: "center" }}>Selecione a carta</h2>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <CustomTable stickyHeader size="small" style={{ maxWidth: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell>Cartas</TableCell>
                <TableCell align="center">
                  <h1 style={{ color: "red" }}>♦</h1>
                </TableCell>
                <TableCell align="center">
                  <h1>♣</h1>
                </TableCell>
                <TableCell align="center">
                  <h1 style={{ color: "red" }}>♥</h1>
                </TableCell>
                <TableCell align="center">
                  <h1>♠</h1>
                </TableCell>
              </TableRow>
            </TableHead>
            {VALUES.map((value) => (
              <TableRow>
                <TableCell component="th" scope="row">
                  <strong>{value}</strong>
                </TableCell>
                {NIPES.map((nipe) => (
                  <TableCell align="center">
                    <Checkbox onClick={() => onChoose(value, nipe)} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </CustomTable>
        </TableContainer>
      </Box>
    </Modal>
  );
}

