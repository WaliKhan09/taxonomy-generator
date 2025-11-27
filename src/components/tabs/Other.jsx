import React from 'react';
import Input from '../ui/Input';

export default function Other({ data, update }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-slate-800 mb-6">Other Settings</h3>

            <div className="grid gap-6">
                <Input
                    label="Update Count Callback"
                    value={data.update_count_callback}
                    onChange={(val) => update('other', 'update_count_callback', val)}
                    placeholder="e.g. _update_post_term_count"
                    helpText="Function name to call when the term count is updated."
                />
            </div>
        </div>
    );
}
