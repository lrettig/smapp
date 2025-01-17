import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { ScreenErrorBoundary } from '../../components/errorHandler';
import { WrapperWith2SideBars, Link, NetworkIndicator, Tooltip, ProgressBar } from '../../basicComponents';
import { smColors } from '../../vars';
import { network } from '../../assets/images';
import { getFormattedTimestamp } from '../../infra/utils';
import { eventsService } from '../../infra/eventsService';
import { RootState } from '../../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const DetailsWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Message = styled.div`
  display: flex;
  flex-direction: row;
  color: ${({ color }) => color};
`;

const DetailsRow = styled.div<{ isLast?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ isLast, theme }) => (isLast ? `0px` : `1px solid ${theme.isDarkMode ? smColors.white : smColors.darkGray10Alpha};`)};
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const GrayText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  text-transform: uppercase;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.dark75Alpha)};
`;

const DetailsTextWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Progress = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
  margin-left: 20px;
`;

const ProgressLabel = styled.div`
  margin-left: 10px;
`;

const Network = ({ history }: RouteComponentProps) => {
  const status = useSelector((state: RootState) => state.node.status);
  const genesisTime = useSelector((state: RootState) => state.node.genesisTime);
  const nodeIndicator = useSelector((state: RootState) => state.node.nodeIndicator);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const networkName = 'TweedleDee 0.1.0';

  const getSyncLabelPercentage = () => {
    if (status && status.syncedLayer && status.currentLayer) {
      return Math.round((parseInt(status.syncedLayer) * 100) / parseInt(status.currentLayer));
    }
    return 0;
  };

  const renderSyncingStatus = () => {
    const progress = getSyncLabelPercentage() / 10;
    return (
      <>
        <NetworkIndicator color={nodeIndicator.color} />
        <ProgressLabel>{nodeIndicator.statusText}</ProgressLabel>
        <ProgressLabel>{getSyncLabelPercentage()}%</ProgressLabel>
        <ProgressLabel>{`${status?.syncedLayer || 0} / ${status?.currentLayer || 0}`}</ProgressLabel>
        <Progress>
          <ProgressBar progress={progress} />
        </Progress>
      </>
    );
  };

  const renderStatus = () => (
    <>
      <NetworkIndicator color={nodeIndicator.color} />
      <ProgressLabel>{nodeIndicator.statusText}</ProgressLabel>
    </>
  );

  const openLogFile = () => {
    eventsService.showFileInFolder({ isBackupFile: true });
  };

  const navigateToChangeNetwork = () => {
    history.push('/main/settings/', { currentSettingIndex: 3 });
  };

  return (
    <WrapperWith2SideBars width={1000} height={500} header="NETWORK" headerIcon={network} subHeader={networkName} isDarkMode={isDarkMode}>
      <Container>
        <Message color={nodeIndicator.color}>{nodeIndicator.message}</Message>
        <DetailsWrap>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Age</DetailsText>
              <Tooltip width={250} text="tooltip age" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>{getFormattedTimestamp(genesisTime)}</GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Status</DetailsText>
              <Tooltip width={250} text="tooltip Status" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>{nodeIndicator.hasError ? renderStatus() : renderSyncingStatus()}</GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Current Layer</DetailsText>
              <Tooltip width={250} text="tooltip Current Layer" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>{status?.currentLayer || 0}</GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Verified Layer</DetailsText>
              <Tooltip width={250} text="tooltip Verified Layer" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>{status?.verifiedLayer || 0}</GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Connection Type</DetailsText>
              <Tooltip width={250} text="tooltip Connection Type" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>Managed p2p node</GrayText>
          </DetailsRow>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Connected neighbors</DetailsText>
              <Tooltip width={250} text="tooltip Connected neighbors" isDarkMode={isDarkMode} />
            </DetailsTextWrap>
            <GrayText>8</GrayText>
          </DetailsRow>
        </DetailsWrap>
        <FooterWrap>
          <Link onClick={navigateToChangeNetwork} text="CHANGE NETWORK" />
          <Tooltip width={250} text="tooltip CHANGE NETWORK" isDarkMode={isDarkMode} />
          <Link onClick={openLogFile} text="BROWSE LOG FILE" style={{ marginLeft: '50px' }} />
          <Tooltip width={250} text="tooltip BROWSE LOG FILE" isDarkMode={isDarkMode} />
        </FooterWrap>
      </Container>
    </WrapperWith2SideBars>
  );
};

export default ScreenErrorBoundary(Network);
