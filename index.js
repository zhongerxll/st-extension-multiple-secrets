import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";
import { eventSource, event_types, saveSettingsDebounced } from "../../../../script.js";
import { getRequestHeaders, callPopup } from '../../../../script.js';
import { oai_settings } from '../../../openai.js';
import { secret_state, updateSecretDisplay, writeSecret } from '../../../secrets.js';

const extensionName = "st-extension-multiple-secrets";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};

async function switchSecretsFromArray(generationType, _args, isDryRun) {
    if (!isDryRun) {
        const key = "api_key_" + oai_settings.chat_completion_source;
        try {
            const response = await fetch('/api/plugins/multiple-secrets/switch', {
                method: 'POST',
                headers: getRequestHeaders(),
                body: JSON.stringify({
                    key
                }),
            });
            if (response.status == 200) {
                secret_state[key] = true;
                updateSecretDisplay();
            }
        } catch {
            console.error('Could not write secret value: ', key);
        }
    }
}

async function saveSecrets() {
    const key = "api_key_" + oai_settings.chat_completion_source
    const value = Array.from(document.querySelectorAll('.multiple-secrets-field')).map(input => input.value).filter(item => item.length > 0);
    await writeSecret(key + "_array", value)
    await switchSecretsFromArray()
    $('#api_button_openai').trigger('click');
}

async function addMultipleSecretsField() {
    $('#multiple-secrets-container').append(`
        <div class="flex-container">
            <input class="text_pole flex1 multiple-secrets-field" maxlength="500" value="" type="text" autocomplete="off" data-i18n="[placeholder]Please enter your API key" placeholder="Please enter your API key"/>
            <div title="Clear your API key" data-i18n="[title]Clear your API key" class="menu_button fa-solid fa-circle-xmark remove-multiple-secrets-field"></div>
        </div>
	`);
}

async function viewSecrets() {
    const response = await fetch('/api/secrets/view', {
        method: 'POST',
        headers: getRequestHeaders(),
    });

    if (response.status == 403) {
        callPopup('<h3>Forbidden</h3><p>To view your API keys here, set the value of allowKeysExposure to true in config.yaml file and restart the SillyTavern server.</p>', 'text');
        return;
    }

    if (!response.ok) {
        return;
    }

    $('#dialogue_popup').addClass('wide_dialogue_popup');
    const data = await response.json();
    const table = document.createElement('table');
    table.classList.add('responsiveTable');
    $(table).append('<thead><th>Key</th><th>Value</th></thead>');

    for (const[key, value] of Object.entries(data)) {
        $(table).append(`<tr><td>${DOMPurify.sanitize(key)}</td><td>${DOMPurify.sanitize(value)}</td></tr>`);
    }

    callPopup(table.outerHTML, 'text');
}

jQuery(async() => {
    const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
    $("#extensions_settings").append(settingsHtml);
    $("#save-secrets").on("click", saveSecrets);
    $('#view-secrets').on('click', viewSecrets);
    $("#add-multiple-secrets-field").on("click", addMultipleSecretsField);
    $(document).on('click', '.remove-multiple-secrets-field', function() {
        $(event.target).closest('.flex-container').remove();
    });
    eventSource.on(event_types.GENERATION_STARTED, switchSecretsFromArray);
});