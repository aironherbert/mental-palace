import styled from "@emotion/styled";
import { Button, Icon, IconButton } from "@mui/material";
import { useCallback, useState } from "react";
import "./App.css";
import Stopwatch from "./components/stopwatch";
import usePersistentState from "./helpers/use-persistent-state";
import CardSelection from "./components/card-selection";
import CustomizedSnackbars from "./components/alert";
import Help from "./components/help";
import { TIPS } from "./helpers/tips";
export const NIPES = ["diamonds", "clubs", "hearts", "spades"];
export const VALUES = [
  "A",
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
];

const Card = styled.div<{ wrong?: boolean }>`
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

  background-color: ${({ wrong }) => (wrong ? "#ff4c4c" : "white")};
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);

  &:hover {
    transform: scale(1.1);

    cursor: pointer;

    transition: transform 0.2s ease-in-out;

    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  }
`;

const SaveCard = styled.div<{ active: boolean }>`
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

  background-color: ${({ active }) => (active ? "#4c7cff" : "white")};
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

function GenerateCard({
  nipe,
  value,
  show,
  wrong,
  setSelected,
}: CardType & {
  show: boolean;
  wrong: boolean;
  setSelected: (card: CardType) => void;
}) {
  const [tips, setTips] = useState<string[]>([]);

  const getTips = useCallback(() => {
    const card = TIPS.find((tip) => tip.nipe === nipe && tip.value === value);
    setTips(card?.tips ?? []);
  }, [nipe, value]);

  if (show) {
    return (
      <div onClick={() => (tips.length === 0 ? getTips() : setTips([]))}>
        <Card>
          <h1>{value}</h1>
          {tips.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {tips.map((tip) => (
                <div key={`tip_${tip}`}>{tip}</div>
              ))}
            </div>
          )}
          {nipe === "diamonds" && <h1 style={{ color: "red" }}>♦</h1>}
          {nipe === "clubs" && <h1>♣</h1>}
          {nipe === "hearts" && <h1 style={{ color: "red" }}>♥</h1>}
          {nipe === "spades" && <h1>♠</h1>}
        </Card>
      </div>
    );
  }
  return (
    <div
      key={`${value}_${nipe}`}
      onClick={() => {
        setSelected({ value, nipe });
      }}
    >
      <Card wrong={wrong}>
        <h1>?</h1>
      </Card>
    </div>
  );
}

interface CardType {
  nipe: string;
  value: string;
}
type T = Record<string, CardType[]>;
export default function App() {
  const [cards, setCards] = useState<CardType[]>();
  const [savedCards, setSavedCards] = usePersistentState<T>("saved-cards", {});
  const [selected, setSelected] = useState<CardType>();
  const [feedback, setFeedback] = useState<{
    severity: "success" | "info" | "warning" | "error";
    message: string;
  }>();
  const [attempts, setAttempts] = usePersistentState<
    Record<string, (CardType & { score: boolean })[]>
  >("attempts", {});

  const [code, setCode] = useState<string>("no-date");
  const [show, setShow] = useState<boolean>(false);
  const [help, setHelp] = useState<boolean>(false);

  const save = useCallback(
    (cards?: CardType[]) => {
      const date = new Date().toLocaleString() ?? "no-date";
      setCode(date);
      setSavedCards((prev: T) => {
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
      setCards([]);
      const newSavedCards = { ...savedCards };
      delete newSavedCards[key];
      setSavedCards(newSavedCards);
    },
    [savedCards, setSavedCards]
  );

  const attempt = useCallback(
    (value: string, nipe: string) => {
      const score = value === selected?.value && nipe === selected?.nipe;
      if (score) {
        setFeedback({
          severity: "success",
          message: "Parabéns! Você acertou.",
        });
      } else {
        setFeedback({
          severity: "error",
          message: "Ops! Tente novamente.",
        });
      }
      setAttempts((prev) => {
        return {
          ...prev,
          [code]: [
            ...(prev[code] ?? []),
            {
              nipe: selected?.nipe ?? "",
              value: selected?.value ?? "",
              score,
            },
          ],
        };
      });
      setSelected(undefined);
    },
    [code, selected, setAttempts]
  );

  const isRight = useCallback(
    (card: CardType) => {
      return (
        attempts[code]
          ?.filter(
            (attempt) =>
              attempt.nipe === card.nipe && attempt.value === card.value
          )
          ?.some((attempt) => attempt.score) ?? false
      );
    },
    [attempts, code]
  );

  const isWrong = useCallback(
    (card: CardType) => {
      return attempts[code]
        ?.filter(
          (attempt) =>
            attempt.nipe === card.nipe && attempt.value === card.value
        )
        ?.some((attempt) => attempt.score === false);
    },
    [attempts, code]
  );
  return (
    <div className="App">
      <div style={{ position: "absolute", right: "1em", top: "1em" }}>
        <IconButton onClick={() => setHelp(true)}>
          <Icon style={{ color: "blue" }}>help</Icon>
        </IconButton>
      </div>
      <h1 style={{ margin: 0 }}>Gerador de Cartas Aleatórias</h1>
      <h4>Jogo de memória</h4>
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
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
            {!show && (
              <>
                <div style={{ color: "green" }}>
                  Acertos:{" "}
                  {attempts[code]?.filter((attempt) => attempt.score).length ??
                    0}
                </div>
                <div style={{ color: "red" }}>
                  Erros:{" "}
                  {attempts[code]?.filter((attempt) => !attempt.score).length ??
                    0}
                </div>
              </>
            )}
          </div>
          <Stopwatch code={code} setShow={setShow} />
          <div
            style={{ display: "flex", justifyContent: "start", width: "100%" }}
          >
            <div style={{ fontWeight: "bold" }}>Sequências salvas:</div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "5px",
              padding: "1em",
              flexWrap: "wrap",
            }}
          >
            {Object.keys(savedCards ?? {}).map((key) => (
              <SaveCard
                key={key}
                active={key === code}
                onClick={() => {
                  setCards(savedCards?.[key]);
                  setCode(key);
                }}
              >
                <IconButton
                  className={"remove-button"}
                  onClick={(e) => {
                    remove(key);
                    e.stopPropagation();
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
          <GenerateCard
            key={`${card.value}_${card.nipe}`}
            nipe={card.nipe}
            value={card.value}
            show={show || isRight(card)}
            wrong={!show && isWrong(card)}
            setSelected={setSelected}
          />
        ))}
      </div>
      {selected && (
        <CardSelection
          onChoose={(value, nipe) => attempt(value, nipe)}
          onClose={() => setSelected(undefined)}
        />
      )}
      {feedback && (
        <CustomizedSnackbars
          severity={feedback?.severity}
          message={feedback?.message}
          onClose={() => setFeedback(undefined)}
        />
      )}
      {help && <Help onClose={() => setHelp(false)} />}
    </div>
  );
}

