import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import Paper from "paper";

import StyleProvider from "./support/style/StyleProvider";
import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";
import { IconButton } from "@mui/material";
import { Calculate, Delete, Functions, PlayArrow } from "@mui/icons-material";
import { Complex } from "./util/complex";
import { calc } from "./support/calc/calc";
import {
  defaultScaleDownFactor,
  drawingLayerName,
  getDrawingLayer,
  getInputLayer,
  inputLayerName,
  inputPaper,
  ouputStrokeWidth,
  outputLayerName,
  outputPaper,
} from "./papers";

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

const CenterControlsWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1000;
  top: 80px;
  left: 50%;
  transform: translate(-50%, 0);
`;

const RunButtonWrapper = styled.div`
  display: inline-flex;
`;

const ClearButtonWrapper = styled.div`
  margin-top: 5px;
`;

const StyledFunctions = styled(Functions)`
  color: rgb(18, 18, 18);
  font-size: 1.3em;
`;

const RunButton = styled(IconButton)`
  background: rgb(102, 187, 106);
  border: 10px solid rgb(18, 18, 18);
  &:hover {
    background-color: rgb(56, 142, 60);;
  }

  &:disabled {
    background-color: rgb(30, 30, 30);
`;

const ClearButton = styled(IconButton)`
  background: rgb(18, 18, 18);
  border: 10px solid rgb(18, 18, 18);
  &:hover {
    background-color: rgb(244, 67, 54);
  }

  &:disabled {
    background-color: rgb(30, 30, 30);
`;

const StyledDelete = styled(Delete)`
  color: white;
`;

function getInput(inputPaper: paper.PaperScope): Complex[] {
  const inputPath = inputPaper.project.activeLayer.lastChild as paper.Path;
  const inputPoints: paper.Point[] = [];
  const steps = 1000;
  const step = inputPath.length / steps;
  for (let i = 0; i < inputPath.length; i += step) {
    inputPoints.push(inputPath.getPointAt(i));
  }
  return inputPoints.map((point) => [point.x, -point.y]);
}

async function drawOutputPoints(
  output: Complex[],
  outputPaper: paper.PaperScope
) {
  outputPaper.project.activeLayer.removeChildren();
  const outputPath = new Paper.Path(output.map(([x, y]) => [x, -y]));
  outputPath.strokeColor = new Paper.Color(0, 1, 0);
  outputPath.strokeWidth = ouputStrokeWidth;
  outputPaper.project.activeLayer.addChild(outputPath);

  // for (let i = 0; i < output.length - 1; i++) {
  //   await sleep(1);
  //   outputPath.add(output[i]);
  // }
}

function compute(input: Complex[]): Complex[] {
  const output: Complex[] = [[0, 0]]; // initial value

  for (let i = 0; i < input.length; i++) {
    output.push(calc([output[output.length - 1]], input[i])[0]); // for now returning for M === 1
  }

  return output.slice(1);
}

function process() {
  const input = getInput(inputPaper);

  console.log(JSON.stringify(input).replaceAll("[", "{").replaceAll("]", "}"));
  const output = compute(input);
  console.log(JSON.stringify(output).replaceAll("[", "{").replaceAll("]", "}"));

  viewFitBounds(outputPaper, new Paper.Path(output.map(([x, y]) => [x, -y])));

  drawOutputPoints(output, outputPaper);
}

function clear(setRunDisabled: (disabled: boolean) => void) {
  inputPaper.project.activeLayer.removeChildren();
  getDrawingLayer().removeChildren();
  outputPaper.project.activeLayer.removeChildren();

  inputPaper.view.center = new Paper.Point(0, 0);
  outputPaper.view.center = new Paper.Point(0, 0);

  inputPaper.view.scale(
    defaultScaleDownFactor *
      Math.min(inputPaper.view.bounds.right, inputPaper.view.bounds.bottom)
  );

  outputPaper.view.scale(
    defaultScaleDownFactor *
      Math.min(outputPaper.view.bounds.right, outputPaper.view.bounds.bottom)
  );

  setRunDisabled(true);
}

function viewFitBounds(paper: paper.PaperScope, path: paper.Path) {
  const viewBounds = paper.view.bounds;
  const scaleRatio = Math.min(
    viewBounds.width / path.bounds.width,
    viewBounds.height / path.bounds.height
  );
  paper.view.translate(
    new Paper.Point(
      viewBounds.center.x - path.bounds.center.x,
      viewBounds.center.y - path.bounds.center.y
    )
  );
  paper.view.scale(scaleRatio * 0.8);
}

function App() {
  const [runDisabled, setRunDisabled] = useState(true);

  return (
    <StyleProvider>
      <Wrapper>
        <CenterControlsWrapper>
          <RunButtonWrapper>
            <RunButton
              size="large"
              color="inherit"
              onClick={process}
              disabled={runDisabled}
            >
              <StyledFunctions fontSize="inherit" />
            </RunButton>
          </RunButtonWrapper>
          <ClearButtonWrapper>
            <ClearButton onClick={clear.bind(null, setRunDisabled)}>
              <StyledDelete />
            </ClearButton>
          </ClearButtonWrapper>
        </CenterControlsWrapper>
        <AreasWrapper>
          <AreaWrapper>
            <InputArea
              paper={inputPaper}
              inputLayerName={inputLayerName}
              drawingLayerName={drawingLayerName}
              setRunDisabled={setRunDisabled}
            />
          </AreaWrapper>
          <AreaWrapper>
            <OutputArea paper={outputPaper} outputLayerName={outputLayerName} />
          </AreaWrapper>
        </AreasWrapper>
      </Wrapper>
    </StyleProvider>
  );
}

export default App;
