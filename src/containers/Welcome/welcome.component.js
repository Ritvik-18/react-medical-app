import React from 'react';
import { Uploader } from '@inrupt/solid-react-components';
import { useTranslation } from 'react-i18next';
import {
  WelcomeWrapper,
  WelcomeCard,
  WelcomeLogo,
  WelcomeProfile,
  WelcomeDetail,
  WelcomeName,
  ImageWrapper,
  center,
  welcomebody
} from './welcome.style';
import { ImageProfile } from '@components';
import { errorToaster } from '@utils';

/**
 * Welcome Page UI component, containing the styled components for the Welcome Page
 * Image component will get theimage context and resolve the value to render.
 * @param props
 */
export const WelcomePageContent = props => {
  const { webId, image, updatePhoto, name } = props;
  const { t } = useTranslation();
  const limit = 2100000;
  return (
    
    <WelcomeWrapper data-testid="welcome-wrapper">
      <WelcomeCard className="card">
        <WelcomeLogo data-testid="welcome-logo">
          <img src="/img/logo.svg" alt="Inrupt" />
        </WelcomeLogo>
        <WelcomeProfile data-testid="welcome-profile">
          <h3>
            {t('welcome.welcome')}, <WelcomeName>{name}</WelcomeName>
          </h3>
          <ImageWrapper>
            <Uploader
              {...{
                fileBase: webId && webId.split('/card')[0],
                limitFiles: 1,
                limitSize: limit,
                accept: 'jpg,jpeg,png',
                errorsText: {
                  sizeLimit: t('welcome.errors.sizeLimit', {
                    limit: `${limit / 1000000}Mbs`
                  }),
                  unsupported: t('welcome.errors.unsupported'),
                  maximumFiles: t('welcome.errors.maximumFiles')
                },
                onError: error => {
                  if (error && error.statusText) {
                    errorToaster(error.statusText, t('welcome.errorTitle'));
                  }
                },
                onComplete: uploadedFiles => {
                  updatePhoto(
                    uploadedFiles[uploadedFiles.length - 1].uri,
                    t('welcome.uploadSuccess'),
                    t('welcome.successTitle')
                  );
                },
                render: props => (
                  <ImageProfile
                    {...{
                      ...props,
                      webId,
                      photo: image,
                      text: t('welcome.upload'),
                      uploadingText: t('welcome.uploadingText')
                    }}
                  />
                )
              }}
            />
          </ImageWrapper>
        </WelcomeProfile>
      </WelcomeCard>
        <WelcomeWrapper data-testid="welcome-wrapper">
      <WelcomeCard className="card">
        <WelcomeDetail data-testid="welcome-detail">
          <div>
            <center><b><h1>About us</h1></b></center>
            <welcomebody>
            <h2>Our Inception</h2>
          <ul> 
           <li>At <b>Medisafe,</b> we work towards making people's <b>lives healthier and their data safer.</b></li>
<li>Sprouted out of the <b>Infosys Summer of Ideas in 2020</b>, we aimed to address the data ownership and safety issues that exist in the world, which we were able to address through this app.</li>
<li><b>The data is in your hands and yours alone.</b> You can choose who has access to your prescriptions and you can <b>revoke the access anytime you please.</b></li>
<li>We provide a platform for all individuals who wish to keep their data safe, while still seamlessly being able to share their data just as they would on the internet.</li>
<li>Through this app, you are able to create and edit your Prescriptions and Personal Medical Profile, in your Personal Pod where they are kept safe.</li>

</ul>
<h2>Our Values</h2>
            <ul>
             
            <li><b>Accountability:</b> We are responsible for keeping your data truly yours.</li>
            <li><b>Collaboration:</b> Leverage collective genius.</li>
            <li><b>Diversity:</b> No one is an outsider.</li>
            <li><b>Passion:</b> Committed in heart and mind.</li>
            <li><b>Quality:</b> What we do, we do well.</li>

              
            </ul>
            </welcomebody>
          </div>

         
        </WelcomeDetail>
      </WelcomeCard>
    </WelcomeWrapper>
    </WelcomeWrapper>
  );
};
