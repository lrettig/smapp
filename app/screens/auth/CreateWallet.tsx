import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createNewWallet } from '../../redux/wallet/actions';
import { CorneredContainer, BackButton } from '../../components/common';
import { StepsContainer, Input, Button, Link, Loader, ErrorPopup, SmallHorizontalPanel } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { chevronRightBlack, chevronRightWhite } from '../../assets/images';
import { smColors, nodeConsts } from '../../vars';
import { RootState } from '../../types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const SubHeader = styled.div`
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const UpperPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 15px;
`;

const Chevron = styled.img`
  width: 8px;
  height: 13px;
  margin-right: 10px;
  align-self: center;
`;

const ErrorSection = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  margin-left: 10px;
`;

const LoaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { mnemonic?: string; withoutNode?: boolean };
  };
}

const CreateWallet = ({ history, location }: Props) => {
  const [subMode, setSubMode] = useState(1);
  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifyPasswordError, setVerifyPasswordError] = useState('');
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  const miningStatus = useSelector((state: RootState) => state.node.miningStatus);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  const renderSubHeader = (subMode: number) => {
    return subMode === 1 ? (
      <SubHeader>Enter a new wallet password. It must be at least 8 characters.</SubHeader>
    ) : (
      <SubHeader>
        For future reference, a wallet restore file was created.
        <br />
        <br />
        <Link onClick={() => eventsService.showFileInFolder({})} text="Browse file location" />
      </SubHeader>
    );
  };

  const validate = () => {
    const pasMinLength = 1; // TODO: Changed to 8 before testnet.
    const hasPasswordError = !password || (!!password && password.length < pasMinLength);
    const hasVerifyPasswordError = !verifiedPassword || password !== verifiedPassword;
    // eslint-disable-next-line no-template-curly-in-string
    const passwordError = hasPasswordError ? 'Password has to be ${pasMinLength} characters or more.' : '';
    const verifyPasswordError = hasVerifyPasswordError ? "These passwords don't match, please try again." : '';
    setPasswordError(passwordError);
    setVerifiedPassword(verifyPasswordError);
    return !passwordError && !verifyPasswordError;
  };

  const createWallet = async () => {
    if (!isLoaderVisible) {
      setIsLoaderVisible(true);
      await setTimeout(async () => {
        dispatch(await createNewWallet({ existingMnemonic: location?.state?.mnemonic, password }));
        setIsLoaderVisible(false);
        setSubMode(2);
      }, 500);
    }
  };

  const handleEnterPress = () => {
    if (validate()) {
      createWallet();
    }
  };

  const handlePasswordTyping = ({ value }: { value: string }) => {
    setPassword(value);
    setPasswordError('');
  };

  const handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    setVerifiedPassword(value);
    setVerifyPasswordError('');
  };

  const nextAction = () => {
    const isWalletOnlySetup = !!location?.state?.withoutNode || miningStatus !== nodeConsts.NOT_MINING;
    if (subMode === 1 && validate()) {
      createWallet();
    } else if (subMode === 2) {
      if (isWalletOnlySetup) {
        history.push('/main/wallet');
      } else {
        history.push('/main/node-setup');
      }
    }
  };

  const navigateToExplanation = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });

  const chevronRight = isDarkMode ? chevronRightWhite : chevronRightBlack;
  if (isLoaderVisible) {
    return (
      <LoaderWrapper>
        <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
      </LoaderWrapper>
    );
  }
  const header = subMode === 1 ? 'PROTECT YOUR WALLET' : 'WALLET PASSWORD PROTECTED';
  const isWalletOnlySetup = !!location?.state?.withoutNode || miningStatus !== nodeConsts.NOT_MINING;
  return (
    <Wrapper>
      <StepsContainer
        steps={isWalletOnlySetup ? ['PROTECT WALLET'] : ['PROTECT WALLET', 'SETUP PROOF OF SPACE']}
        header={isWalletOnlySetup ? 'SETUP WALLET' : 'SETUP WALLET + SMESHER'}
        currentStep={0}
        isDarkMode={isDarkMode}
      />
      <CorneredContainer width={650} height={400} header={header} subHeader={renderSubHeader(subMode)} isDarkMode={isDarkMode}>
        <SmallHorizontalPanel isDarkMode={isDarkMode} />
        {subMode === 1 && (
          <>
            <BackButton action={history.goBack} />
            <UpperPart>
              <Inputs>
                <InputSection>
                  <Chevron src={chevronRight} />
                  <Input value={password} type="password" placeholder="ENTER PASSWORD" onEnterPress={handleEnterPress} onChange={handlePasswordTyping} />
                </InputSection>
                <InputSection>
                  <Chevron src={chevronRight} />
                  <Input value={verifiedPassword} type="password" placeholder="VERIFY PASSWORD" onEnterPress={handleEnterPress} onChange={handlePasswordVerifyTyping} />
                </InputSection>
              </Inputs>
              <ErrorSection>
                {(!!passwordError || !!verifyPasswordError) && (
                  <ErrorPopup
                    onClick={() => {
                      setPasswordError('');
                      setVerifyPasswordError('');
                    }}
                    text={passwordError || verifyPasswordError}
                  />
                )}
              </ErrorSection>
            </UpperPart>
          </>
        )}
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET GUIDE" />
          {subMode === 1 && <Link onClick={() => history.push('/auth/restore')} text="RESTORE WALLET" />}
          <Button onClick={nextAction} text="NEXT" />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default CreateWallet;
