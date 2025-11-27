import React from 'react';
import Input from '../ui/Input';

export default function Labels({ data, update }) {
    const labels = [
        { key: 'menu_name', label: 'Menu Name', placeholder: 'e.g. Genres' },
        { key: 'name_admin_bar', label: 'Admin Bar Name', placeholder: 'e.g. Genre' },
        { key: 'all_items', label: 'All Items', placeholder: 'e.g. All Genres' },
        { key: 'add_new_item', label: 'Add New Item', placeholder: 'e.g. Add New Genre' },
        { key: 'new_item_name', label: 'New Item Name', placeholder: 'e.g. New Genre Name' },
        { key: 'parent_item', label: 'Parent Item', placeholder: 'e.g. Parent Genre' },
        { key: 'parent_item_colon', label: 'Parent Item Colon', placeholder: 'e.g. Parent Genre:' },
        { key: 'search_items', label: 'Search Items', placeholder: 'e.g. Search Genres' },
        { key: 'popular_items', label: 'Popular Items', placeholder: 'e.g. Popular Genres' },
        { key: 'separate_items_with_commas', label: 'Separate with Commas', placeholder: 'e.g. Separate genres with commas' },
        { key: 'add_or_remove_items', label: 'Add or Remove Items', placeholder: 'e.g. Add or remove genres' },
        { key: 'choose_from_most_used', label: 'Choose from Most Used', placeholder: 'e.g. Choose from the most used genres' },
        { key: 'not_found', label: 'Not Found', placeholder: 'e.g. No genres found' },
    ];

    return (
        <div>
            <h3 className="text-lg font-medium text-slate-800 mb-6">Labels Configuration</h3>
            <p className="text-sm text-slate-500 mb-6">Customize the labels used in the WordPress admin interface.</p>

            <div className="grid md:grid-cols-2 gap-6">
                {labels.map((item) => (
                    <Input
                        key={item.key}
                        label={item.label}
                        value={data[item.key]}
                        onChange={(val) => update('labels', item.key, val)}
                        placeholder={item.placeholder}
                    />
                ))}
            </div>
        </div>
    );
}
