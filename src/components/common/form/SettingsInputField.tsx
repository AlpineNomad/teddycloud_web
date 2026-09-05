import { Checkbox, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useField } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SettingsDataHandler from "../../../data/SettingsDataHandler";

type InputFieldProps = {
    name: string;
    label?: string;
    description?: string;
    overlayed?: boolean | undefined;
    overlayId?: string;
};

export const SettingsInputField: React.FC<InputFieldProps> = (props) => {
    const { t } = useTranslation();
    const { name, label, description, overlayed: initialOverlayed } = props;
    const [field, meta] = useField(name!);
    const [overlayed, setOverlayed] = useState<boolean | undefined>(initialOverlayed); // State to track overlayed boolean

    const [fieldValue, setFieldValue] = useState(
        SettingsDataHandler.getInstance().getSetting(name)?.value,
    );
    const idListener = () => {
        setFieldValue(SettingsDataHandler.getInstance().getSetting(name)?.value);
        setOverlayed(
            overlayed !== undefined
                ? SettingsDataHandler.getInstance().getSetting(name)?.overlayed
                : undefined,
        );
    };
    SettingsDataHandler.getInstance().addIdListener(idListener, name);

    const hasFeedback = !!(meta.touched && meta.error);
    const help = meta.touched && meta.error && t(meta.error);
    const validateStatus = meta.touched && meta.error ? "error" : undefined;

    let value = fieldValue?.toString();
    const isTagFilterId = name === "core.tag_filter.content_id";
    const invalidTagFilterId = isTagFilterId && !/^[0-9a-fA-F]{8}$/.test(value ?? "");

    const suffix = [
        overlayed === undefined ? null : (
            <Checkbox
                checked={overlayed}
                onChange={(changeEventHandler) => {
                    SettingsDataHandler.getInstance().changeSettingOverlayed(
                        name,
                        changeEventHandler.target.checked,
                    );
                    setOverlayed(SettingsDataHandler.getInstance().getSetting(name)?.overlayed);
                }}
                key="overlayCheckBox"
            >
                {t("settings.overlayed")}
            </Checkbox>
        ),
    ];

    return (
        <FormItem
            help={
                invalidTagFilterId
                    ? t("settings.tagFilter.invalidId")
                    : hasFeedback
                      ? help
                      : undefined
            }
            validateStatus={invalidTagFilterId ? "error" : validateStatus}
            extra={isTagFilterId ? t("settings.tagFilter.content_id.description") : undefined}
            label={<span style={{ textWrap: "auto", lineHeight: "1.2" }}>{label}</span>}
            tooltip={description}
        >
            <Input
                {...field}
                value={value}
                {...(isTagFilterId ? { maxLength: 8, placeholder: "FFFFFFFF" } : {})}
                onChange={(changeEventHandler) => {
                    SettingsDataHandler.getInstance().changeSetting(
                        name,
                        changeEventHandler.target.value,
                        overlayed,
                    );
                    setFieldValue(SettingsDataHandler.getInstance().getSetting(name)?.value);
                }}
                {...(overlayed !== undefined ? { suffix } : null)}
                disabled={!overlayed && overlayed !== undefined}
            />
        </FormItem>
    );
};
