import React from 'react';
import Input from '../ui/Input';

export default function General({ data, update }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-slate-800 mb-6">General Settings</h3>

            <div className="grid gap-6">
                <Input
                    label="Taxonomy Key"
                    value={data.taxonomy}
                    onChange={(val) => update('general', 'taxonomy', val)}
                    placeholder="e.g. genre"
                    helpText="The unique key for your taxonomy (lowercase, no spaces)."
                />

                <Input
                    label="Text Domain"
                    value={data.text_domain}
                    onChange={(val) => update('general', 'text_domain', val)}
                    placeholder="e.g. my-theme"
                    helpText="Used for translation strings."
                />
            </div>
        </div>
    );
}
