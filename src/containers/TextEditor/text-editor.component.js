/* eslint-disable constructor-super */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */

import React, { useState, useEffect } from "react";
import { Loader } from "@util-components";
import { useTranslation } from "react-i18next";
import SolidAuth from "solid-auth-client";
import { successToaster, errorToaster, languageHelper } from "@utils";
import ldflex from "@solid/query-ldflex";
import { AccessControlList, ACLFactory } from "@inrupt/solid-react-components";
import {
  TextEditorWrapper,
  TextEditorContainer,
  Header,
  Form,
  FullGridSize,
  Button,
  Label,
  Input,
  WebId,
} from "./text-editor.style";
import { FormModel } from "@inrupt/solid-react-components";
import { FormWrapper } from "../FormModel/form-model.style";
import { AutoSaveSpinner } from "@components";

type Props = { webId: String };
const language = languageHelper.getLanguageCode();
function extractWacAllow(response) {
  // WAC-Allow: user="read write append control",public="read"
  const modes = {
    user: {
      read: false,
      append: false,
      write: false,
      control: false,
    },
    public: {
      read: false,
      append: false,
      write: false,
      control: false,
    },
  };

  const wacAllowHeader = response.headers.get("WAC-Allow");
  if (wacAllowHeader) {
    wacAllowHeader // 'user="read write append control",public="read"'
      .split(",") // ['user="read write append control"', 'public="read"']
      .map((str) => str.trim())
      .forEach((statement) => {
        // 'user="read write append control"'
        const parts = statement.split("="); // ['user', '"read write control"']
        if (
          parts.length >= 2 &&
          ["user", "public"].indexOf(parts[0]) !== -1 &&
          parts[1].length > 2
        ) {
          const modeStr = parts[1].replace(/"/g, ""); // 'read write control' or ''
          if (modeStr.length) {
            modeStr.split(" ").forEach((mode) => {
              modes[parts[0]][mode] = true;
            });
          }
        }
      });
  }
  return modes;
}

export const Editor = ({ webId }: Props) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [friend, setFriend] = useState(
    "https://example-friend.com/profile/card#me"
  );
  const [, setText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [editable, setEditable] = useState(false);
  const [sharable, setSharable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  async function setUrlFromStorage() {
    if (webId && !url) {
      const storageRoot = await ldflex[webId].storage;
      if (storageRoot) {
        const exampleUrl = new URL(`${storageRoot.value}pres/ENTER_FILE_NAME.ttl`);
        setUrl(exampleUrl);
      }
    }
  }
  const onError = (e) => {
    if (e.message.toString().indexOf("Validation failed") < 0) {
      errorToaster(
        t("formLanguage.renderer.formNotLoaded"),
        t("notifications.error"),
        {
          label: t("errorFormRender.link.label"),
          href: t("errorFormRender.link.href"),
        }
      );
      setIsLoading(false);
    }
  };

  const onDelete = () => {
    successToaster(
      t("formLanguage.renderer.fieldDeleted"),
      t("notifications.success")
    );
  };

  const onAddNewField = () => {
    successToaster(
      t("formLanguage.renderer.fieldAdded"),
      t("notifications.success")
    );
  };

  useEffect(() => {
    setUrlFromStorage();
  }, [webId]);

  function handleUrlChange(event) {
    event.preventDefault();
    setUrl(event.target.value);
  }

  function handleFriendChange(event) {
    event.preventDefault();
    setFriend(event.target.value);
  }


  function handleLoad(event) {
    event.preventDefault();
    const doc = SolidAuth.fetch(url);
    doc
      .then(async (response) => {
        const text = await response.text();
        if (response.ok) {
          setText(text);
        } else if (response.status === 404) {
          successToaster(t("notifications.404"));
        } else {
          errorToaster(t("notifications.errorLoading"));
        }
        const wacAllowModes = extractWacAllow(response);
        setEditable(wacAllowModes.user.write);
        setSharable(wacAllowModes.user.control);
        setLoaded(true);
      })
      .catch(() => {
        errorToaster(t("notifications.errorFetching"));
      });
  } // assuming the logged in user doesn't change without a page refresh

  async function handleShare(event) {
    event.preventDefault();
    try {
      const permissions = [
        {
          agents: [friend],
          modes: [AccessControlList.MODES.READ, AccessControlList.MODES.WRITE],
        },
      ];
      const ACLFile = await ACLFactory.createNewAcl(webId, url);
      await ACLFile.createACL(permissions);
      successToaster(t("notifications.accessGranted"));
    } catch (e) {
      errorToaster(t("notifications.errorGrantingAccess"));
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    // Not using LDFlex here, because this is not an RDF document.
    const result = await SolidAuth.fetch(url, {
      method: "PUT",
      body:
        '\n@prefix : <#>.\n@prefix solid: <http://www.w3.org/ns/solid/terms#>.\n@prefix foaf: <http://xmlns.com/foaf/0.1/>.\n@prefix pim: <http://www.w3.org/ns/pim/space#>.\n@prefix schema: <http://schema.org/>.\n@prefix ldp: <http://www.w3.org/ns/ldp#>.\n@prefix pro: <./>.\n@prefix n0: <http://www.w3.org/ns/auth/acl#>.\n@prefix inbox: </inbox/>.\n@prefix rit: </>.\n@prefix n: <http://www.w3.org/2006/vcard/ns#>.\n\n<> n:fn "EnterName"; n:hasAddress :1600783143643; n:role "EnterRole".\n\n:1600783143643 n:locality "false", "true".\n:me\na schema:Person, foaf:Person;\nn:fn "Name";\nn:hasAddress :1600764986357, :1600768422537, :1600768435760;\nn0:trustedApp\n[\nn0:mode n0:Append, n0:Control, n0:Read, n0:Write;\nn0:origin <http://localhost:3000>\n];\nldp:inbox inbox:;\npim:preferencesFile </settings/prefs.ttl>;\npim:storage rit:;\nsolid:account rit:;\nsolid:privateTypeIndex </settings/privateTypeIndex.ttl>;\nsolid:publicTypeIndex </settings/publicTypeIndex.ttl>;\nfoaf:name "Test Ryan".\npro:card a foaf:PersonalProfileDocument; foaf:maker :me; foaf:primaryTopic :me.',
      headers: {
        "Content-Type": "text/turtle",
      },
    });

    if (result.ok) {
      successToaster(t("notifications.saved"));
    } else if (result.ok === false) {
      errorToaster(t("notifications.errorSaving"));
    }
  }

  return (
    <Form>
      <FullGridSize>
        <WebId>
          <b>
            Connected as: <a href={webId}>{webId}</a>
          </b>
        </WebId>
      </FullGridSize>
      <FullGridSize>
        <Label>
          {t("editor.url")}:
          <Input
            type="text"
            size="200"
            value={url}
            onChange={handleUrlChange}
          />
        </Label>
        <div className="input-wrap">
          <Button
            className="ids-link-filled ids-link-filled--primary button"
            onClick={handleLoad}
          >
            {t("editor.load")}
          </Button>
          {editable ? (
            <Button
              className="ids-link-filled ids-link-filled--secondary button"
              onClick={handleSave}
            >
              {t("editor.save")}
            </Button>
          ) : loaded ? (
            t("notifications.notEditable")
          ) : (
            ""
          )}
        </div>
      </FullGridSize>
      <FullGridSize>
        <FormWrapper>
          <FormModel
            {...{
              modelSource:
                "https://ritvik18.solid.community/public/pres.ttl#formRoot",
              dataSource: url,
              viewer: false,
              onInit: () => {
                setIsLoading(true);
              },
              onLoaded: () => {
                setIsLoading(false);
              },
              onSuccess: () => {},
              onSave: () => {},
              onError: (error) => {
                onError(error);
              },
              onAddNewField: (response) => onAddNewField(response),
              onDelete: (response) => onDelete(response),
              options: {
                theme: {
                  inputText: "input-wrap",
                  inputCheckbox: "sdk-checkbox checkbox",
                  form: "inrupt-sdk-form",
                  childGroup: "inrupt-form-group",
                  groupField: "group-wrapper",
                  multipleField: "multiple-wrapper",
                },
                autosave: true,
                autosaveIndicator: AutoSaveSpinner,
                language,
              },
            }}
            liveUpdate
          />
          {isLoading && <Loader absolute />}
        </FormWrapper>
      </FullGridSize>
      {sharable && (
        <FullGridSize>
          <Label>
            {t("editor.friend")}:
            <Input
              type="text"
              size="200"
              value={friend}
              onChange={handleFriendChange}
            />
          </Label>
          <Button
            className="ids-link-stroke ids-link-stroke--primary button"
            onClick={handleShare}
          >
            {t("editor.grantAccess")}
          </Button>
        </FullGridSize>
      )}
      {loaded && !sharable && t("notifications.notSharable")}
    </Form>
  );
};

/**
 * A React component page that is displayed when there's no valid route. Users can click the button
 * to get back to the home/welcome page.
 */
const TextEditor = ({ webId }: Props) => {
  const { t } = useTranslation();
  console.log(webId);
  return (
    <TextEditorWrapper>
      <TextEditorContainer>
        <Header>
          <p>{t("editor.explanation")}</p>
        </Header>
        <Editor webId={webId} />
      </TextEditorContainer>
    </TextEditorWrapper>
  );
};

export default TextEditor;
