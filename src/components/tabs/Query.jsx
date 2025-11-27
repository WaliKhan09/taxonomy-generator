import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function Query({ data, update }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-slate-800 mb-6">Query Settings</h3>

            <div className="grid gap-6">
                <Select
                    label="Public Queryable"
                    value={data.publicly_queryable}
                    onChange={(val) => update('query', 'publicly_queryable', val)}
                    options={[
                        { value: 'yes', label: 'True' },
                        { value: 'no', label: 'False' }
                    ]}
                    helpText="Whether the taxonomy is publicly queryable."
                />

                <Input
                    label="Query Var"
                    value={data.query_var}
                    onChange={(val) => update('query', 'query_var', val)}
                    placeholder="e.g. genre"
                    helpText="Sets the query_var key for this taxonomy."
                />
            </div>
        </div>
    );
}
