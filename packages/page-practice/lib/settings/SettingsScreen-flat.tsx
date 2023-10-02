import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
import { Screen } from "@keybr/pages-shared";
import { type Settings, SettingsContext, useSettings } from "@keybr/settings";
import { Button, Field, FieldList, Header, Icon } from "@keybr/widget";
import { mdiCheckCircle } from "@mdi/js";
import { type ReactNode, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { LayoutSettings } from "./LayoutSettings.tsx";
import { LessonSettings } from "./LessonSettings-flat.tsx";
import { MiscSettings } from "./MiscSettings.tsx";
import * as styles from "./SettingsScreen-flat.module.less";
import { TypingSettings } from "./TypingSettings.tsx";

export function SettingsScreen({
  onSubmit,
}: {
  readonly onSubmit: (newSettings: Settings) => void;
}): ReactNode {
  const { settings } = useSettings();
  const [newSettings, setNewSettings] = useState(settings);
  const keyboard = useMemo(
    () => loadKeyboard(newSettings.layout, { full: true }),
    [newSettings.layout],
  );

  return (
    <SettingsContext.Provider
      value={{
        settings: newSettings,
        updateSettings: (newSettings) => {
          setNewSettings(newSettings);
        },
      }}
    >
      <KeyboardContext.Provider value={keyboard}>
        <Content
          onSubmit={() => {
            onSubmit(newSettings);
          }}
        />
      </KeyboardContext.Provider>
    </SettingsContext.Provider>
  );
}

function Content({ onSubmit }: { readonly onSubmit: () => void }): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <Screen>
      <Header level={1}>
        <FormattedMessage
          id="settings.lessonsTabLabel"
          description="Tab label."
          defaultMessage="Lessons"
        />
      </Header>
      <LessonSettings />

      <div className={styles.spacer} />

      <Header level={1}>
        <FormattedMessage
          id="settings.typingTabLabel"
          description="Tab label."
          defaultMessage="Typing"
        />
      </Header>
      <TypingSettings />

      <div className={styles.spacer} />

      <Header level={1}>
        <FormattedMessage
          id="settings.keyboardTabLabel"
          description="Tab label."
          defaultMessage="Keyboard"
        />
      </Header>
      <LayoutSettings />

      <div className={styles.spacer} />

      <Header level={1}>
        <FormattedMessage
          id="settings.miscellaneousTabLabel"
          description="Tab label."
          defaultMessage="Miscellaneous"
        />
      </Header>
      <MiscSettings />

      <div className={styles.spacer} />

      <FieldList>
        <Field.Filler />
        <Field>
          <Button
            icon={<Icon shape={mdiCheckCircle} />}
            label={formatMessage({
              id: "settings.doneButtonLabel",
              description: "Button label.",
              defaultMessage: "Done",
            })}
            title={formatMessage({
              id: "settings.doneButtonTitle",
              description: "Button title.",
              defaultMessage: "Save changes and start practicing.",
            })}
            onClick={() => {
              onSubmit();
            }}
          />
        </Field>
      </FieldList>
    </Screen>
  );
}
