import styled from "@emotion/styled";
import { Card, Icon, IconButton } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

const TimeList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;
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
export default function Stopwatch() {
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [play, setPlay] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

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

  return (
    <Card>
      <div style={{ display: "flex", width: "500px" }}>
        <TimeList>
          <Card>Time List</Card>
        </TimeList>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
            <IconButton>
              <Icon>add_circle</Icon>
            </IconButton>
          </div>
        </div>
      </div>
    </Card>
  );
}

