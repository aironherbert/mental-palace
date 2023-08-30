import { Box, Modal } from "@mui/material";

const style = {
  boxSizing: "border-box",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflow: "auto",
  padding: "10px 5px",
};

interface Proptypes {
  onClose: () => void;
}

export default function Help({ onClose }: Proptypes) {
  return (
    <Modal open onClose={onClose}>
      <Box sx={style}>
        <h2 style={{ margin: 10, textAlign: "center" }}>Instruções</h2>
        <p style={{ margin: 10, textAlign: "center" }}>
          O objetivo do jogo é memorizar a ordem das cartas por meio da técnica
          do Palácio Mental. Para isso, você deve associar cada carta a um
          objeto em um cômodo da sua casa ou em um trajeto que você conheça bem.
        </p>
        <h3 style={{ margin: 10, textAlign: "center" }}>Dicas mnemônicas</h3>
        <h5 style={{ margin: 10, textAlign: "center" }}>Naipes</h5>
        <p style={{ margin: 10, textAlign: "justify" }}>
          <ul>
            <li>
              PAUS – Todas as cartas deste naipe começarão pela consoante P.
            </li>
            <li>
              ESPADAS – A letra T parece uma espada fincada no chão. Assim,
              todas as cartas deste naipe começarão pela letra T.
            </li>
            <li>COPAS – Todas as cartas deste naipe começarão pela letra C.</li>
            <li>OUROS – Todas as cartas deste naipe começarão pela letra S.</li>
          </ul>
        </p>
        <h5 style={{ margin: 10, textAlign: "center" }}>Valores</h5>
        <p style={{ margin: 10, textAlign: "justify" }}>
          <ul>
            <li>A – T apenas</li>
            <li>2 – N ou NH</li>
            <li>3 – M</li>
            <li>4 – RR apenas</li>
            <li>5 – L ou LH</li>
            <li>6 – X, CH, J ou G fraco</li>
            <li>7 – C forte ou G forte</li>
            <li>8 – F apenas</li>
            <li>9 – P ou B</li>
            <li>10 – Sons correspondentes ao 0 (S, Z, Ç, XC)</li>
            <li>J (Valete) – V</li>
            <li>Q (Dama) – D</li>
            <li>K (Rei) – R</li>
          </ul>
        </p>
      </Box>
    </Modal>
  );
}

