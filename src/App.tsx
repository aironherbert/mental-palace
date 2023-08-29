import styled from "@emotion/styled";
import { Button, Icon, IconButton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
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
    cursor: pointer;
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

function GenerateCard({ nipe, value }: { nipe: string; value: string }) {
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

export default function App() {
  const [cards, setCards] = useState<{ nipe: string; value: string }[]>();
  const [savedCards, setSavedCards] =
    useState<Record<string, { nipe: string; value: string }[]>>();

  useEffect(() => {
    const savedCards = localStorage.getItem("saved-cards");
    if (savedCards) {
      setSavedCards(JSON.parse(savedCards));
    }
  }, []);

  const generate = useCallback(() => {
    const cards = new Set<{ nipe: string; value: string }>();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 13; j++) {
        cards.add({ nipe: NIPES[i], value: VALUES[j] });
      }
    }

    const shuffledCards = Array.from(cards).sort(() => Math.random() - 0.5);
    const selectedCards = shuffledCards.slice(0, 52);

    setCards(selectedCards);
  }, []);

  const save = useCallback(() => {
    const date = new Date().toLocaleString() ?? "no-date";
    setSavedCards((prev) => {
      return {
        ...prev,
        [date]: cards ?? [],
      };
    });

    localStorage.setItem(
      "saved-cards",
      JSON.stringify({
        ...savedCards,
        [date]: cards ?? [],
      })
    );
  }, [cards, savedCards]);

  const remove = useCallback(
    (key: string) => {
      setSavedCards((prev) => {
        const newSavedCards = { ...prev };
        delete newSavedCards[key];
        return newSavedCards;
      });

      localStorage.setItem(
        "saved-cards",
        JSON.stringify({
          ...savedCards,
          [key]: cards ?? [],
        })
      );
    },
    [cards, savedCards]
  );

  return (
    <div className="App">
      <h1>Gerador de Cartas</h1>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          padding: "1em",
        }}
      >
        <Button variant="contained" color="primary" onClick={() => generate()}>
          Gerar aleatório
        </Button>
        {/* <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setCards([]);
            localStorage.removeItem("saved-cards");
            setSavedCards({});
          }}
        >
          Limpar
        </Button> */}
        <Button variant="contained" color="warning" onClick={() => save()}>
          Salvar
        </Button>
      </div>
      <div
        style={{ width: "100%", display: "flex", gap: "10px", padding: "1em" }}
      >
        <span style={{ fontWeight: "bold" }}>Salvos:</span>
        {Object.keys(savedCards ?? {}).map((key) => (
          <SaveCard
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              setCards(savedCards?.[key]);
            }}
          >
            <IconButton className={"remove-button"} onClick={() => remove(key)}>
              <Icon>remove_circle</Icon>
            </IconButton>
            {key}
          </SaveCard>
        ))}
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

