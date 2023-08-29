import styled from "@emotion/styled";
import { Button, Icon, IconButton } from "@mui/material";
import { useCallback, useState } from "react";
import "./App.css";
import Stopwatch from "./components/stopwatch";
import usePersistentState from "./helpers/use-persistent-state";
const NIPES = ["diamonds", "clubs", "hearts", "spades"];
const VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

const Card = styled.div`
  width: 100px;
  height: 150px;
  border: 1px solid black;
  border-radius: 5px;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  background-color: white;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);

  &:hover {
    transform: scale(1.1);

    transition: transform 0.2s ease-in-out;

    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  }
`;

const SaveCard = styled.div`
  width: 100px;
  height: 50px;
  border: 1px solid black;
  border-radius: 5px;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;

  background-color: white;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);

  &:hover {
    cursor: pointer;
    transform: scale(1.1);

    transition: transform 0.2s ease-in-out;

    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);

    .remove-button {
      display: block;
    }
  }

  .remove-button {
    position: absolute;
    display: none;
    top: -25px;
    right: -25px;

    color: red;
  }
`;

function GenerateCard({ nipe, value }: CardType) {
  return (
    <Card>
      <h1>{value}</h1>
      {nipe === "diamonds" && <h1 style={{ color: "red" }}>♦</h1>}
      {nipe === "clubs" && <h1>♣</h1>}
      {nipe === "hearts" && <h1 style={{ color: "red" }}>♥</h1>}
      {nipe === "spades" && <h1>♠</h1>}
    </Card>
  );
}

interface CardType {
  nipe: string;
  value: string;
}

export default function App() {
  const [cards, setCards] = useState<CardType[]>();
  const [savedCards, setSavedCards] = usePersistentState(
    "saved-cards",
    {} as { [key: string]: CardType[] }
  );

  const [code, setCode] = useState<string>("no-date");

  const save = useCallback(
    (cards?: CardType[]) => {
      const date = new Date().toLocaleString() ?? "no-date";
      setCode(date);
      setSavedCards((prev: { [key: string]: CardType[] }) => {
        return {
          ...prev,
          [date]: cards ?? [],
        };
      });
    },
    [setSavedCards]
  );

  const generate = useCallback(() => {
    const cards = new Set<CardType>();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 13; j++) {
        cards.add({ nipe: NIPES[i], value: VALUES[j] });
      }
    }

    const shuffledCards = Array.from(cards).sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, 52);

    setCards(selectedCards);
    save(selectedCards);
  }, [save]);

  const remove = useCallback(
    (key: string) => {
      const newSavedCards = { ...savedCards };
      delete newSavedCards[key];
      setSavedCards(newSavedCards);
    },
    [savedCards, setSavedCards]
  );

  return (
    <div className="App">
      <h1>Gerador de cartas aleatórias</h1>
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              padding: "1em",
              alignItems: "start",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => generate()}
            >
              Gerar
            </Button>
          </div>
          <Stopwatch code={code} />
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "5px",
              padding: "1em",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Sequências salvas:</span>
            {Object.keys(savedCards ?? {}).map((key) => (
              <SaveCard
                key={key}
                onClick={() => {
                  setCards(savedCards?.[key]);
                  setCode(key);
                }}
              >
                <IconButton
                  className={"remove-button"}
                  onClick={() => {
                    remove(key);
                  }}
                >
                  <Icon>remove_circle</Icon>
                </IconButton>
                {key}
              </SaveCard>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {cards?.map((card) => (
          <GenerateCard nipe={card.nipe} value={card.value} />
        ))}
      </div>
    </div>
  );
}

