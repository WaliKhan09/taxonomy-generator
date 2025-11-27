import React from 'react';
import Checkbox from '../ui/Checkbox';

export default function Visibility({ data, update }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-slate-800 mb-6">Visibility Settings</h3>

            <div className="grid gap-4">
                <Checkbox
                    label="Public"
                    checked={data.public}
                    onChange={(val) => update('visibility', 'public', val)}
                    helpText="Whether a taxonomy is intended for use publicly either via the admin interface or by front-end users."
                />

                <Checkbox
                    label="Show UI"
                    checked={data.show_ui}
                    onChange={(val) => update('visibility', 'show_ui', val)}
                    helpText="Whether to generate and allow a UI for managing terms in this taxonomy on the admin page."
                />

                <Checkbox
                    label="Show in REST"
                    checked={data.show_in_rest}
                    onChange={(val) => update('visibility', 'show_in_rest', val)}
                    helpText="Whether to include the taxonomy in the REST API. Set this to true for the Block Editor."
                />

                <Checkbox
                    label="Show Admin Column"
                    checked={data.show_admin_column}
                    onChange={(val) => update('visibility', 'show_admin_column', val)}
                    helpText="Whether to allow automatic creation of taxonomy columns on associated post-types listing screens."
                />

                <Checkbox
                    label="Show in Nav Menus"
                    checked={data.show_in_nav_menus}
                    onChange={(val) => update('visibility', 'show_in_nav_menus', val)}
                    helpText="Whether to make the taxonomy available for selection in navigation menus."
                />

                <Checkbox
                    label="Show Tagcloud"
                    checked={data.show_tagcloud}
                    onChange={(val) => update('visibility', 'show_tagcloud', val)}
                    helpText="Whether to list the taxonomy in the Tag Cloud Widget controls."
                />
            </div>
        </div>
    );
}
