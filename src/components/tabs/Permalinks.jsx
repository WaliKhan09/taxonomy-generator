import React from 'react';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';

export default function Permalinks({ data, update }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-slate-800 mb-6">Permalinks Settings</h3>

            <div className="grid gap-6">
                <Checkbox
                    label="Rewrite"
                    checked={data.rewrite}
                    onChange={(val) => update('permalinks', 'rewrite', val)}
                    helpText="Whether to rewrite the permalinks."
                />

                <Input
                    label="Custom Slug"
                    value={data.slug}
                    onChange={(val) => update('permalinks', 'slug', val)}
                    placeholder="e.g. genre"
                    helpText="Custom taxonomy slug."
                />

                <Checkbox
                    label="With Front"
                    checked={data.with_front}
                    onChange={(val) => update('permalinks', 'with_front', val)}
                    helpText="Should the permalink structure be prepended with the front base."
                />
            </div>
        </div>
    );
}
