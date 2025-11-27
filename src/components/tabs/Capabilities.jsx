import React from 'react';
import Input from '../ui/Input';

export default function Capabilities({ data, update }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-slate-800 mb-6">Capabilities Settings</h3>
            <p className="text-sm text-slate-500 mb-6">Control the capabilities required to manage terms in this taxonomy.</p>

            <div className="grid md:grid-cols-2 gap-6">
                <Input
                    label="Manage Terms"
                    value={data.manage_terms}
                    onChange={(val) => update('capabilities', 'manage_terms', val)}
                    placeholder="manage_categories"
                />

                <Input
                    label="Edit Terms"
                    value={data.edit_terms}
                    onChange={(val) => update('capabilities', 'edit_terms', val)}
                    placeholder="manage_categories"
                />

                <Input
                    label="Delete Terms"
                    value={data.delete_terms}
                    onChange={(val) => update('capabilities', 'delete_terms', val)}
                    placeholder="manage_categories"
                />

                <Input
                    label="Assign Terms"
                    value={data.assign_terms}
                    onChange={(val) => update('capabilities', 'assign_terms', val)}
                    placeholder="edit_posts"
                />
            </div>
        </div>
    );
}
