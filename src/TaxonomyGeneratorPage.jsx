import React, { useState, useEffect } from "react";
import General from "./components/tabs/General";
import Taxonomy from "./components/tabs/Taxonomy";
import Labels from "./components/tabs/Labels";
import Visibility from "./components/tabs/Visibility";
import Query from "./components/tabs/Query";
import Permalinks from "./components/tabs/Permalinks";
import Capabilities from "./components/tabs/Capabilities";
import RestApi from "./components/tabs/RestApi";
import Other from "./components/tabs/Other";
import { generateCodeFromFormData, defaultData } from "./utils/generator";

// Single-file React component that recreates the Taxonomy Generator page shown in the image.
// Tailwind CSS classes are used for styling (no external CSS required beyond Tailwind)
// Default export is the page component.

export default function TaxonomyGeneratorPage() {
    const [activeTab, setActiveTab] = useState("General");
    const [formData, setFormData] = useState(defaultData);
    const [code, setCode] = useState("");

    // Update code when formData changes
    useEffect(() => {
        const { code } = generateCodeFromFormData(formData);
        setCode(code);
    }, [formData]);

    const updateFormData = (section, key, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const tabs = [
        "General",
        "Taxonomy",
        "Labels",
        "Visibility",
        "Query",
        "Permalinks",
        "Capabilities",
        "Rest API",
        "Other",
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "General": return <General data={formData.general} update={updateFormData} />;
            case "Taxonomy": return <Taxonomy data={formData.taxonomy} update={updateFormData} />;
            case "Labels": return <Labels data={formData.labels} update={updateFormData} />;
            case "Visibility": return <Visibility data={formData.visibility} update={updateFormData} />;
            case "Query": return <Query data={formData.query} update={updateFormData} />;
            case "Permalinks": return <Permalinks data={formData.permalinks} update={updateFormData} />;
            case "Capabilities": return <Capabilities data={formData.capabilities} update={updateFormData} />;
            case "Rest API": return <RestApi data={formData.rest} update={updateFormData} />;
            case "Other": return <Other data={formData.other} update={updateFormData} />;
            default: return null;
        }
    };

    function handleUpdateCode() {
        const { code } = generateCodeFromFormData(formData);
        setCode(code);
    }

    function handleSaveSnippet() {
        // simple download of the code as a file
        const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "taxonomy-snippet.php";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
            {/* Header */}
            <header className="w-full">
                <div className="bg-gradient-to-r from-purple-50 via-fuchsia-50 to-violet-50">
                    <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">G</div>
                            <h1 className="text-lg font-medium">Taxonomy Generator</h1>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600">
                            <a className="hover:underline" href="#">Generators</a>
                        </div>
                    </div>
                </div>

                {/* Tabs row */}
                <nav className="border-b border-slate-100">
                    <div className="max-w-6xl mx-auto px-6 py-3">
                        <ul className="flex flex-wrap gap-4 text-sm text-slate-600">
                            {tabs.map((t) => (
                                <li
                                    key={t}
                                    onClick={() => setActiveTab(t)}
                                    className={`cursor-pointer px-2 py-1 rounded transition-colors ${activeTab === t ? 'text-purple-700 font-semibold bg-purple-100' : 'hover:text-slate-800 hover:bg-slate-50'}`}>
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </header>

            {/* Main content */}
            <main className="flex-1">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    {/* Form Area */}
                    <section className="bg-white border border-slate-100 rounded shadow-sm p-6 mb-8">
                        {activeTab === 'General' && (
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-sm">
                                <div>
                                    <h3 className="font-medium text-slate-700">Overview</h3>
                                    <p className="mt-2 text-slate-500">Use this tool to create custom code for taxonomies with <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">register_taxonomy()</code> function.</p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-slate-700">Usage</h3>
                                    <ul className="mt-2 list-disc pl-5 text-slate-500 space-y-2">
                                        <li>Fill in the user-friendly form.</li>
                                        <li>Click the "Update Code" button.</li>
                                        <li>Copy the code to your project.</li>
                                        <li>Or save it as a snippet and share.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-slate-700">Examples</h3>
                                    <ul className="mt-2 list-disc pl-5 text-slate-500 space-y-2">
                                        <li>Music Genre</li>
                                        <li>Book Publisher</li>
                                        <li>Car Manufacturer</li>
                                        <li>Region</li>
                                    </ul>
                                </div>
                            </section>
                        )}
                        {renderTabContent()}
                    </section>

                    {/* Code editor area */}
                    <section className="bg-white border border-slate-100 rounded shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <button onClick={handleUpdateCode} className="px-3 py-1 rounded bg-purple-700 text-white text-sm hover:bg-purple-800 transition-colors">Update Code</button>
                                <button onClick={handleSaveSnippet} className="px-3 py-1 rounded border border-slate-200 text-sm hover:bg-slate-50 transition-colors">Save Snippet</button>
                            </div>

                            <div className="text-xs text-slate-400">Preview (PHP)</div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="w-full">
                                <div className="bg-slate-50 border border-slate-100 rounded p-4 overflow-visible">
                                    <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700">{code}</pre>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-purple-900 text-purple-100">
                <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-purple-200">
                    © Taxonomy Generator • By Mohammad Wali Khan
                </div>
            </footer>
        </div>
    );
}
