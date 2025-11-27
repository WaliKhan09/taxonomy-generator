import React from 'react';
import Input from '../ui/Input';

export default function RestApi({ data, update }) {
    return (
        <div>
            <h3 className="text-lg font-medium text-slate-800 mb-6">REST API Settings</h3>

            <div className="grid gap-6">
                <Input
                    label="REST Base"
                    value={data.rest_base}
                    onChange={(val) => update('rest', 'rest_base', val)}
                    placeholder="e.g. genre"
                    helpText="The base path for this taxonomy's REST API endpoint."
                />

                <Input
                    label="REST Controller Class"
                    value={data.rest_controller_class}
                    onChange={(val) => update('rest', 'rest_controller_class', val)}
                    placeholder="WP_REST_Terms_Controller"
                    helpText="REST API Controller class name."
                />
            </div>
        </div>
    );
}
