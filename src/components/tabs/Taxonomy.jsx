import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function Taxonomy({ data, update }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-slate-800 mb-6">Taxonomy Configuration</h3>

            <div className="grid md:grid-cols-2 gap-6">
                <Input
                    label="Singular Name"
                    value={data.singular}
                    onChange={(val) => update('taxonomy', 'singular', val)}
                    placeholder="e.g. Genre"
                />

                <Input
                    label="Plural Name"
                    value={data.plural}
                    onChange={(val) => update('taxonomy', 'plural', val)}
                    placeholder="e.g. Genres"
                />

                <Input
                    label="Post Types"
                    value={data.post_types}
                    onChange={(val) => update('taxonomy', 'post_types', val)}
                    placeholder="e.g. post, page, product"
                    helpText="Comma separated list of post types to attach to."
                />

                <Select
                    label="Hierarchical"
                    value={data.hierarchical}
                    onChange={(val) => update('taxonomy', 'hierarchical', val)}
                    options={[
                        { value: 'no', label: 'False (Tag-like)' },
                        { value: 'yes', label: 'True (Category-like)' }
                    ]}
                    helpText="Whether the taxonomy is hierarchical (like categories) or not (like tags)."
                />
            </div>
        </div>
    );
}
