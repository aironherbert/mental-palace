import styled from "@emotion/styled";
import { Card, Icon, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import usePersistentState from "../helpers/use-persistent-state";

const Display = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;

  h1 {
    margin: 0;
    padding: 0;
    font-stretch: expanded;
  }
`;

const Container = styled.div`
  display: flex;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

type Time = {
  minutes: string;
  seconds: string;
};

interface Proptypes {
  code: string;
  setShow: (show: boolean) => void;
}

export default function Stopwatch({ code, setShow }: Proptypes) {
  const [dataTime, setDataTime] = usePersistentState<Record<string, Time>>(
    code,
    {}
  );
  const [time, setTime] = useState<Time>(
    () => dataTime[code] ?? { minutes: "00", seconds: "00" }
  );
  const [play, setPlay] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setTime(() => dataTime[code] ?? { minutes: "00", seconds: "00" });
    setPlay(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    if (play) {
      timer.current = setInterval(() => {
        setTime((prev: Time) => {
          const minutes = prev.minutes ?? "00";
          const seconds = prev.seconds ?? "00";
          if (seconds === "59") {
            if (minutes === "59") {
              return {
                minutes: "00",
                seconds: "00",
              };
            } else {
              return {
                minutes: String(parseInt(minutes, 1) + 1).padStart(2, "0"),
                seconds: "00",
              };
            }
          }
          return {
            minutes: minutes,
            seconds: String(parseInt(seconds, 10) + 1).padStart(2, "0"),
          };
        });
      }, 1000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [play, setTime]);

  useEffect(() => {
    setShow(play);
  }, [play, setShow]);

  useEffect(() => {
    setDataTime((prev) => {
      return {
        ...prev,
        [code]: time,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <Card style={{ alignSelf: "end" }}>
      <Container>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Display>
            <h1>{time.minutes}</h1>
            <h1>:</h1>
            <h1>{time.seconds}</h1>
          </Display>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <IconButton
              style={{ gap: "10px" }}
              onClick={() => setPlay((prev) => !prev)}
            >
              {play ? (
                <>
                  Pausar
                  <Icon style={{ color: "blueviolet" }}>pause_circle</Icon>
                </>
              ) : (
                <>
                  Ver cartas
                  <Icon style={{ color: "blue" }}>play_circle</Icon>
                </>
              )}
            </IconButton>
          </div>
        </div>
      </Container>
    </Card>
  );
}

