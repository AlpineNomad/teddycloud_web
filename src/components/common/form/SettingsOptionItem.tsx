import SettingsDataHandler from "../../../data/SettingsDataHandler";
import { SettingsInputField } from "./SettingsInputField";
import { SettingsInputNumberField } from "./SettingsInputNumberField";
import { SettingsSwitchField } from "./SettingsSwitchField";
import { useTranslation } from "react-i18next";

interface SettingsOptionItem {
    iD: string;
    noOverlay?: boolean;
    overlayId?: string;
}

export const SettingsOptionItem: React.FC<SettingsOptionItem> = (props) => {
    const { t } = useTranslation();
    const { iD } = props;
    const option = SettingsDataHandler.getInstance().getSetting(props.iD);

    const overlayedProp = props.noOverlay ? undefined : option?.overlayed;

    if (option !== undefined) {
        const { type } = option;
        const tagFilterKey = iD.startsWith("core.tag_filter.")
            ? iD.slice("core.tag_filter.".length)
            : undefined;
        const label = tagFilterKey
            ? t(`settings.tagFilter.${tagFilterKey}.label`, option.label)
            : option.label;
        const description = tagFilterKey
            ? t(`settings.tagFilter.${tagFilterKey}.description`, option.description)
            : option.description;

        return (
            <div key={iD}>
                {type === "bool" && (
                    <SettingsSwitchField
                        name={iD}
                        label={label}
                        description={description}
                        overlayed={overlayedProp}
                        overlayId={props.overlayId}
                    />
                )}
                {type === "int" && (
                    <SettingsInputNumberField
                        name={iD}
                        label={label}
                        description={description}
                        overlayed={overlayedProp}
                        overlayId={props.overlayId}
                    />
                )}
                {type === "uint" && (
                    <SettingsInputNumberField
                        name={iD}
                        label={label}
                        description={description}
                        overlayed={overlayedProp}
                        overlayId={props.overlayId}
                    />
                )}
                {type === "string" && (
                    <SettingsInputField
                        name={iD}
                        label={label}
                        description={description}
                        overlayed={props.noOverlay ? undefined : option?.overlayed}
                        overlayId={props.overlayId}
                    />
                )}
            </div>
        );
    } else {
        console.warn("No option found for iD ", iD);
        return <></>;
    }
};
