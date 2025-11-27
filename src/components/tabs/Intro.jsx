import React from 'react';

export default function Intro() {
    return (
        <div className="grid md:grid-cols-3 gap-12 text-sm text-gray-600">
            <div>
                <h3 className="text-gray-900 font-semibold mb-3 uppercase tracking-wider text-xs">Overview</h3>
                <p className="mb-4">
                    This tool is used to create custom taxonomies for your WordPress projects.
                    It generates the necessary PHP code using the <code>register_taxonomy()</code> function.
                </p>
            </div>

            <div>
                <h3 className="text-gray-900 font-semibold mb-3 uppercase tracking-wider text-xs">Usage</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Fill out the form sections.</li>
                    <li>Click "Update Code" to generate.</li>
                    <li>Copy the snippet into your project.</li>
                    <li>Share with the community.</li>
                </ul>
            </div>

            <div>
                <h3 className="text-gray-900 font-semibold mb-3 uppercase tracking-wider text-xs">Example</h3>
                <p className="mb-2">Common use cases for custom taxonomies include:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Music Genre</li>
                    <li>Book Publisher</li>
                    <li>Car Manufacturer</li>
                    <li>Region</li>
                </ul>
            </div>
        </div>
    );
}
