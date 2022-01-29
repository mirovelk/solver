import styled from "@emotion/styled";
import React, { useRef } from "react";
import Paper, { Color } from "paper";

import StyleProvider from "./support/style/StyleProvider";
import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";
import { IconButton } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { Complex } from "./util/complex";
import { calc } from "./support/calc/calc";

const Wrapper = styled.div`
  position: realtive;
  height: 100%;
`;

const AreasWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  align-items: stretch;
`;

const AreaWrapper = styled.div`
  flex: 1 0 0;
  &:not(:last-child) {
    margin-right: 20px;
  }
`;

const RunButtonWrapper = styled.div`
  display: inline-block;
  position: absolute;
  z-index: 1000;
  top: 80px;
  left: 50%;
  transform: translate(-50%, 0);
`;

const StyledPlayArrow = styled(PlayArrow)`
  color: rgb(18, 18, 18);
`;

const RunButton = styled(IconButton)`
  background: rgb(144, 202, 249);
  border: 10px solid rgb(18, 18, 18);
  &:hover {
    background-color: rgb(66, 165, 245);
  }

  &:disabled {
    background-color: rgb(30, 30, 30);
`;

function getInput(
  inputPathRef: React.MutableRefObject<paper.Path | undefined>
): Complex[] {
  const inputPoints: paper.Point[] = [];
  if (inputPathRef.current) {
    const steps = 1000;
    const step = inputPathRef.current?.length / steps;
    for (let i = 0; i < inputPathRef.current?.length; i += step) {
      inputPoints.push(inputPathRef.current?.getPointAt(i));
    }
  }
  return inputPoints.map((point) => [point.x, -point.y]);
}

function drawOutputPoints(
  output: Complex[],
  outputPaperRef: React.MutableRefObject<paper.PaperScope | undefined>
) {
  if (outputPaperRef.current) {
    const outputPath = new outputPaperRef.current.Path(output);
    outputPath.strokeColor = new Color(0, 1, 0);
    outputPath.strokeWidth = 3;
    outputPaperRef.current.project.activeLayer.addChild(outputPath);
  }
}

function compute(input: Complex[]): Complex[] {
  // const output: Complex[] = input.map(([x, y]) => [x, -y]);

  const output: Complex[] = [[0, 0]]; // initial value

  for (let i = 0; i < input.length; i++) {
    output.push(calc([output[output.length - 1]], input[i])[0]); // for now returning for M === 1
  }

  return output.slice(1).map(([x, y]) => [x, -y]);
}

function process(
  inputPathRef: React.MutableRefObject<paper.Path | undefined>,
  outputPaperRef: React.MutableRefObject<paper.PaperScope | undefined>
) {
  const input = getInput(inputPathRef);

  console.log(JSON.stringify(input).replaceAll("[", "{").replaceAll("]", "}"));
  const output = compute(input);
  console.log(JSON.stringify(output).replaceAll("[", "{").replaceAll("]", "}"));

  drawOutputPoints(output, outputPaperRef);
}

function App() {
  const inputPaperRef = useRef(new Paper.PaperScope());
  const outputPaperRef = useRef(new Paper.PaperScope());

  const inputPathRef = useRef<paper.Path>();

  return (
    <StyleProvider>
      <Wrapper>
        <RunButtonWrapper>
          <RunButton
            size="large"
            color="inherit"
            onClick={() => process(inputPathRef, outputPaperRef)}
          >
            <StyledPlayArrow fontSize="inherit" />
          </RunButton>
        </RunButtonWrapper>
        <AreasWrapper>
          <AreaWrapper>
            <InputArea
              paper={inputPaperRef.current}
              inputPathRef={inputPathRef}
            />
          </AreaWrapper>
          <AreaWrapper>
            <OutputArea paper={outputPaperRef.current} />
          </AreaWrapper>
        </AreasWrapper>
      </Wrapper>
    </StyleProvider>
  );
}

export default App;
