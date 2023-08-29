import styled from "@emotion/styled";
import { Card, Icon, IconButton, List, ListItem } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import usePersistentState from "../helpers/use-persistent-state";

const TimeList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 2;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
`;
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

type TimeType = {
  minutes: string;
  seconds: string;
  date: string;
};
interface Proptypes {
  code: string;
}
export default function Stopwatch({ code }: Proptypes) {
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [play, setPlay] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  const [timeList, setTimeList] = usePersistentState(
    "time-list",
    {} as { [key: string]: TimeType[] }
  );

  useEffect(() => {
    const times = timeList[code];
    if (times) {
      const lastTime = times[times.length - 1];
      if (lastTime) {
        setMinutes(lastTime.minutes);
        setSeconds(lastTime.seconds);
      }
    } else {
      setMinutes("00");
      setSeconds("00");
    }
  }, [code, timeList]);

  useEffect(() => {
    if (play) {
      timer.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === "59") {
            setMinutes((prev) => {
              if (prev === "59") {
                return "00";
              } else {
                return String(parseInt(prev, 10) + 1).padStart(2, "0");
              }
            });
            return "00";
          } else {
            return String(parseInt(prev, 10) + 1).padStart(2, "0");
          }
        });
      }, 1000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [play]);

  const reset = useCallback(() => {
    setPlay(false);
    setMinutes("00");
    setSeconds("00");
  }, []);

  const add = useCallback(() => {
    if (timeList[code]) {
      setTimeList((prev: { [key: string]: TimeType[] }) => ({
        ...prev,
        [code]: [
          ...prev[code],
          { minutes, seconds, date: new Date().toLocaleString() },
        ],
      }));
    } else {
      setTimeList((prev: { [key: string]: TimeType[] }) => ({
        ...prev,
        [code]: [{ minutes, seconds, date: new Date().toLocaleString() }],
      }));
    }
    setPlay(false);
  }, [code, minutes, seconds, setTimeList, timeList]);

  const remove = useCallback(
    (index: number) => {
      setTimeList((prev: { [key: string]: TimeType[] }) => ({
        ...prev,
        [code]: prev[code].filter((_, i) => i !== index),
      }));
    },
    [code, setTimeList]
  );

  return (
    <Card style={{ alignSelf: "end" }}>
      <Container>
        <TimeList>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: 150,
            }}
          >
            {timeList[code]?.map((time: TimeType, index: number) => (
              <ListItem sx={{ margin: 0, padding: 0, whiteSpace: "nowrap" }}>
                {index + 1} - {time.minutes}:{time.seconds} ({time.date})
                <IconButton onClick={() => remove(index)}>
                  <Icon style={{ color: "red" }}>remove_circle</Icon>
                </IconButton>
              </ListItem>
            ))}
          </List>
        </TimeList>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Display>
            <h1>{minutes}</h1>
            <h1>:</h1>
            <h1>{seconds}</h1>
          </Display>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <IconButton onClick={() => setPlay((prev) => !prev)}>
              {play ? <Icon>pause_circle</Icon> : <Icon>play_circle</Icon>}
            </IconButton>
            <IconButton onClick={() => reset()}>
              <Icon>stop_circle</Icon>
            </IconButton>
            <IconButton onClick={() => add()}>
              <Icon>add_circle</Icon>
            </IconButton>
          </div>
        </div>
      </Container>
    </Card>
  );
}

