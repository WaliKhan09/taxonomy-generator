// server.js (drop-in ready)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ----------------- Helpers -----------------
function escapePhp(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/'/g, "\\'");
}
function pluralize(s) {
  if (!s) return s;
  s = String(s).trim();
  if (/y$/i.test(s)) return s.slice(0, -1) + 'ies';
  if (/s$/i.test(s)) return s;
  return s + 's';
}
function tidyLabel(v) {
  if (!v) return '';
  return String(v).trim().replace(/_/g, ' ');
}

// Parse body produced by your front-end (keys like "general[taxonomy]" or nested objects)
function normalizeRequestBody(body) {
  // output: nested data object (group -> keys) and flat form map for templates
  const data = {};
  const flat = {};

  // If body already contains objects (e.g. nested), copy them
  for (const k in body) {
    if (typeof body[k] === 'object' && body[k] !== null && !Array.isArray(body[k])) {
      data[k] = Object.assign({}, body[k]);
      for (const sub in body[k]) {
        flat[sub] = body[k][sub];
      }
    }
  }

  // Handle bracketed keys like general[taxonomy] or taxonomy[key]
  for (const k in body) {
    if (!body.hasOwnProperty(k)) continue;
    if (/\[.+\]/.test(k)) {
      // split by [ and ] -> e.g. "general[taxonomy]" => ["general","taxonomy"]
      const parts = k.split(/[\[\]]+/).filter(Boolean);
      if (parts.length >= 2) {
        const parent = parts[0];
        const child = parts[1];
        data[parent] = data[parent] || {};
        data[parent][child] = body[k];
        flat[child] = body[k];
      } else {
        // fallback
        flat[k] = body[k];
      }
    } else {
      // plain key (rare in your forms) => set as top-level flat and also to data.general if ambiguous
      if (!data[k]) flat[k] = body[k];
    }
  }

  return { data, flat };
}

// Safe boolean check helpers
function isYes(val) {
  return val === 'yes' || val === 'on' || val === true || val === 'true';
}
function isNo(val) {
  return val === 'no' || val === false || val === 'false' || val === 'off';
}

// Build labels PHP section from labels object
function buildLabelsPhp(labelsObj, singularLabel, pluralLabel, textDomain) {
  const keys = {
    name: pluralLabel,
    singular_name: singularLabel,
    menu_name: labelsObj.menu_name || pluralLabel,
    name_admin_bar: labelsObj.name_admin_bar || singularLabel,
    archives: labelsObj.archives || `${singularLabel} Archives`,
    attributes: labelsObj.attributes || `${singularLabel} Attributes`,
    parent_item_colon: labelsObj.parent_item_colon || `Parent ${singularLabel}:`,
    all_items: labelsObj.all_items || `All ${pluralLabel}`,
    add_new_item: labelsObj.add_new_item || `Add New ${singularLabel}`,
    add_new: labelsObj.add_new || `Add New`,
    new_item: labelsObj.new_item || `New ${singularLabel}`,
    edit_item: labelsObj.edit_item || `Edit ${singularLabel}`,
    update_item: labelsObj.update_item || `Update ${singularLabel}`,
    view_item: labelsObj.view_item || `View ${singularLabel}`,
    view_items: labelsObj.view_items || `View ${pluralLabel}`,
    search_items: labelsObj.search_items || `Search ${pluralLabel}`,
    not_found: labelsObj.not_found || `No ${pluralLabel} found`,
    not_found_in_trash: labelsObj.not_found_in_trash || `No ${pluralLabel} found in Trash`,
    featured_image: labelsObj.featured_image || `${singularLabel} Image`,
    set_featured_image: labelsObj.set_featured_image || `Set ${singularLabel} image`,
    remove_featured_image: labelsObj.remove_featured_image || `Remove ${singularLabel} image`,
    use_featured_image: labelsObj.use_featured_image || `Use as ${singularLabel} image`,
    insert_into_item: labelsObj.insert_into_item || `Insert into ${singularLabel}`,
    uploaded_to_this_item: labelsObj.uploaded_to_this_item || `Uploaded to this ${singularLabel}`,
    items_list: labelsObj.items_list || `${pluralLabel} list`,
    items_list_navigation: labelsObj.items_list_navigation || `${pluralLabel} list navigation`,
    filter_items_list: labelsObj.filter_items_list || `Filter ${pluralLabel} list`,
  };

  const lines = ["\t$labels = array("];
  for (const k in keys) {
    const v = escapePhp(keys[k]);
    if (k === 'name') {
      lines.push(`\t\t'${k}' => _x( '${v}', '${singularLabel} General Name', '${textDomain}' ),`);
    } else if (k === 'singular_name') {
      lines.push(`\t\t'${k}' => _x( '${v}', '${singularLabel} Singular Name', '${textDomain}' ),`);
    } else {
      lines.push(`\t\t'${k}' => __( '${v}', '${textDomain}' ),`);
    }
  }
  lines.push("\t);");
  return lines.join('\n');
}

// Build args PHP section (visibility, rest, permalinks, capabilities, query, other)
function buildArgsPhp(groups, singularLabel, textDomain) {
  const visibility = groups.visibility || {};
  const permalinks = groups.permalinks || {};
  const capabilities = groups.capabilities || {};
  const rest = groups.rest || {};
  const query = groups.query || {};
  const other = groups.other || {};

  const isPublic = visibility.public === 'no' ? false : true;
  const showUi = visibility.show_ui === 'no' ? false : true;
  const showInRest = isYes(visibility.show_in_rest) || isYes(rest.show_in_rest);

  const useSlug = permalinks.use_slug === 'no' ? false : true;
  const slugVal = permalinks.url_slug || '';
  const rewrite = useSlug ? `array( 'slug' => '${escapePhp(slugVal)}' )` : 'false';

  const args = [];
  args.push("\t$args = array(");
  args.push("\t\t'labels' => $labels,");
  args.push(`\t\t'hierarchical' => ${groups.taxonomy && (groups.taxonomy.hierarchical === 'yes' || groups.taxonomy.hierarchical === 'on') ? 'true' : 'false'},`);
  args.push(`\t\t'public' => ${isPublic ? 'true' : 'false'},`);
  args.push(`\t\t'show_ui' => ${showUi ? 'true' : 'false'},`);
  args.push(`\t\t'show_in_rest' => ${showInRest ? 'true' : 'false'},`);
  args.push(`\t\t'rewrite' => ${rewrite},`);

  // Query var - if custom query var was provided
  if (query && (query.custom_query || query.default === 'false')) {
    if (query.default === 'false') {
      args.push("\t\t'query_var' => false,");
    } else if (query.custom_query && query.custom_query.trim()) {
      args.push(`\t\t'query_var' => '${escapePhp(query.custom_query.trim())}',`);
    }
  }

  // Capabilities
  const capKeys = ['manage_terms','edit_terms','delete_terms','assign_terms'];
  const caps = [];
  capKeys.forEach(k => {
    if (capabilities[k]) caps.push(`\t\t\t'${k}' => '${escapePhp(capabilities[k])}',`);
  });
  if (caps.length) {
    args.push("\t\t'capabilities' => array(");
    caps.forEach(line => args.push(line));
    args.push("\t\t),");
  }

  // REST options: rest_base and rest_controller_class
  if (rest && rest.rest_base) {
    args.push(`\t\t'rest_base' => '${escapePhp(rest.rest_base)}',`);
  }
  if (rest && rest.rest_controller_class) {
    args.push(`\t\t'rest_controller_class' => '${escapePhp(rest.rest_controller_class)}',`);
  }

  // Other: update_count_callback
  if (other && other.update_count_callback) {
    args.push(`\t\t'update_count_callback' => '${escapePhp(other.update_count_callback)}',`);
  }

  args.push("\t);");
  return args.join('\n');
}

// ----------------- Generator -----------------
function generateCodeFromFormData(rawBody) {
  // rawBody is req.body (flat keys or nested)
  const { data: groups, flat: flatForm } = normalizeRequestBody(rawBody);

  // Ensure groups exist
  const general = groups.general || {};
  const taxonomy = groups.taxonomy || {};
  const labelsIn = groups.labels || {};
  const visibility = groups.visibility || {};
  const query = groups.query || {};
  const permalinks = groups.permalinks || {};
  const capabilities = groups.capabilities || {};
  const rest = groups.rest || {};
  const other = groups.other || {};

  // Fallbacks and core
  const taxonomyKeyRaw = (taxonomy.key || general.taxonomy || flatForm.taxonomy || 'custom_taxonomy').toString();
  const taxonomyKey = taxonomyKeyRaw.replace(/\s+/g, '_').toLowerCase().slice(0, 32);
  const singular = tidyLabel(taxonomy.singular || flatForm.singular || taxonomyKey);
  const plural = tidyLabel(taxonomy.plural || flatForm.plural || pluralize(singular));
  const textDomain = general.text_domain || flatForm.text_domain || 'text_domain';
  const postTypesRaw = taxonomy.post_types || flatForm.post_types || 'post';
  const postTypes = postTypesRaw.toString().split(',').map(s => s.trim()).filter(Boolean);

  // Build sections
  const labelsPhp = buildLabelsPhp(labelsIn, singular, plural, textDomain);
  const argsPhp = buildArgsPhp(groups, singular, textDomain);

  const postTypesPhp = postTypes.length ? postTypes.map(pt => `'${escapePhp(pt)}'`).join(', ') : "'post'";

  const lines = [];
  lines.push("<?php");
  lines.push(`// Register Custom Taxonomy: ${taxonomyKey}`);
  lines.push(`function ${taxonomyKey}_taxonomy() {`);
  lines.push('');
  lines.push(labelsPhp);
  lines.push('');
  lines.push(argsPhp);
  lines.push(`\tregister_taxonomy( '${taxonomyKey}', array( ${postTypesPhp} ), $args );`);
  lines.push('');
  lines.push("}");
  lines.push(`add_action( 'init', '${taxonomyKey}_taxonomy', 0 );`);
  lines.push("?>");

  return { code: lines.join('\n'), flatForm: flatForm };
}

// ----------------- Routes -----------------

app.get('/', (req, res) => {
  // default nested data
  const defaultData = {
    general: { taxonomy: 'custom_taxonomy', text_domain: 'text_domain' },
    taxonomy: { key: 'taxonomy', singular: 'Taxonomy', plural: 'Taxonomies', post_types: 'post', hierarchical: 'no' },
    labels: {},
    visibility: {},
    query: {},
    permalinks: {},
    capabilities: {},
    rest: {},
    other: {}
  };

  const result = generateCodeFromFormData(defaultData);
  // For EJS partials we expose a flat form map (so <%= form.key %> works)
  const form = Object.assign({}, result.flatForm, defaultData.general, defaultData.taxonomy, defaultData.labels);
  res.render('index', { generated: result.code, form });
});

// AJAX generate endpoint
app.post('/generate', (req, res) => {
  try {
    const result = generateCodeFromFormData(req.body || {});
    return res.json({ success: true, code: result.code });
  } catch (err) {
    console.error('Generation error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// optional save snippet endpoint (compatible with earlier code)
app.post('/save', (req, res) => {
  const { title = 'Unnamed snippet', code = '' } = req.body || {};
  const file = path.join(__dirname, 'snippets.json');
  let snippets = [];
  try {
    if (fs.existsSync(file)) {
      snippets = JSON.parse(fs.readFileSync(file));
    }
  } catch (err) {
    console.error('Read snippets error', err);
  }
  const newEntry = { id: Date.now(), title, code, created_at: new Date().toISOString() };
  snippets.push(newEntry);
  try {
    fs.writeFileSync(file, JSON.stringify(snippets, null, 2));
    return res.json({ ok: true, snippet: newEntry });
  } catch (err) {
    console.error('Write snippet error', err);
    return res.status(500).json({ ok: false, error: 'Could not save' });
  }
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
