import React from 'react';
import {
  WelcomeWrapper,
  WelcomeCard,
  WelcomeDetail,
  center
} from './welcome.style';

/**
 * Welcome Page UI component, containing the styled components for the Welcome Page
 * Image component will get theimage context and resolve the value to render.
 * @param props
 */
export const WelcomePageContent = props => {
  return (
    <WelcomeWrapper data-testid="welcome-wrapper">
      <WelcomeCard className="card">
        <WelcomeDetail data-testid="welcome-detail">
          <div>
          <center><b><h1>How to use Medisafe</h1></b> </center>
           <h3><b>Profile:</b></h3>
            <ul>
              <li>
            Your <b>WebID</b> will be displayed in the profile page which cannot be altered.
              </li>
              <li>
            You can change your <b>display picture</b> by clicking on it and uploading a supported file.
              </li>
              <li>
              In the Profile tab you can update:
              <ul>
                <li>
                  Your <b>Personal profile</b>
                </li>
                <li>
                Your <b>Medical Profile</b>
                </li>
              </ul>
              </li>
            </ul>
            <h3><b>Prescription:</b></h3>
            <ul>
              <li>
              <b>Creating a new Prescription:</b> When you try and load a file after providing the appropriate <b>path</b> to the file, and no file is detected at that location, you will be prompted to create a new file. You can do so by using the <b>“Create” Button</b>.              </li>
              <li>
              <b>Editing a Prescription:</b> Once a Prescription has been loaded it can be edited by entering the data in the given field. The changes made to the Prescription are <b>saved automatically.</b>               </li>
              <li>
              <b>Loading an old Prescription:</b> Prescriptions can be loaded by providing the <b>path</b> of the Prescription in the text box and pressing the <b>“Load” Button</b>. This Prescription can be your own, or someone else’s if they have given you access to that file.
              </li>
              <li>
            	<b>Sharing your Prescription:</b> You can share your prescription to the other users by entering their <b>WebIID</b> in the textbox provided at the end of the prescription page and clicking on the <b>“Grant Access” Button.</b>
              </li>
              </ul>
          
          </div>

         
        </WelcomeDetail>
      </WelcomeCard>
    </WelcomeWrapper>
  );
};
