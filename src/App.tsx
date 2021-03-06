import styled from '@emotion/styled';
import { Delete, Functions } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Paper from 'paper';
import { useCallback } from 'react';

import InputArea from './components/InputArea';
import { defaultScaleDownFactor } from './components/InteractiveCanvas/util';
import OutputArea from './components/OutputArea';
import { inputPaper, outputPaper } from './papers';
import {
  calculateAllOutputPaths,
  clearInputOuputValues,
  selectActiveSheetIputValues,
  setInputZoom,
  setOutputZoom,
} from './redux/features/app/appSlice';
import { useAppDispatch, useAppSelector } from './redux/store';
import StyleProvider from './support/style/StyleProvider';

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
  top: 60px;
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

const INPUT_STEPS = 1000;

function App() {
  const dispatch = useAppDispatch();
  const activeSheetInputValues = useAppSelector(selectActiveSheetIputValues);

  const process = useCallback(() => {
    dispatch(calculateAllOutputPaths());
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearInputOuputValues());

    inputPaper.view.center = new Paper.Point(0, 0);
    outputPaper.view.center = new Paper.Point(0, 0);

    inputPaper.view.scale(
      defaultScaleDownFactor *
        Math.min(inputPaper.view.bounds.right, inputPaper.view.bounds.bottom)
    );
    dispatch(setInputZoom(inputPaper.view.zoom));

    outputPaper.view.scale(
      defaultScaleDownFactor *
        Math.min(outputPaper.view.bounds.right, outputPaper.view.bounds.bottom)
    );
    dispatch(setOutputZoom(outputPaper.view.zoom));
  }, [dispatch]);

  return (
    <StyleProvider>
      <Wrapper>
        <CenterControlsWrapper>
          <RunButtonWrapper>
            <RunButton
              size="large"
              color="inherit"
              onClick={process}
              disabled={activeSheetInputValues.length === 0}
            >
              <StyledFunctions fontSize="inherit" />
            </RunButton>
          </RunButtonWrapper>
          <ClearButtonWrapper>
            <ClearButton onClick={clear}>
              <StyledDelete />
            </ClearButton>
          </ClearButtonWrapper>
        </CenterControlsWrapper>
        <AreasWrapper>
          <AreaWrapper>
            <InputArea paper={inputPaper} inputSteps={INPUT_STEPS} />
          </AreaWrapper>
          <AreaWrapper>
            <OutputArea paper={outputPaper} />
          </AreaWrapper>
        </AreasWrapper>
      </Wrapper>
    </StyleProvider>
  );
}

export default App;
