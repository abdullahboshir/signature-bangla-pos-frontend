
const axios = require('axios');

async function run() {
    try {
        console.log("Fetching data...");
        const [catsRes, subCatsRes, childCatsRes] = await Promise.all([
            axios.get('http://localhost:5000/api/v1/super-admin/categories?limit=1000'),
            axios.get('http://localhost:5000/api/v1/super-admin/categories/sub?limit=1000'),
            axios.get('http://localhost:5000/api/v1/super-admin/categories/child?limit=1000'),
        ]);

        const cats = catsRes.data.data?.result || catsRes.data.data || [];
        const subCats = subCatsRes.data.data?.result || subCatsRes.data.data || [];
        const childCats = childCatsRes.data.data?.result || childCatsRes.data.data || [];

        console.log(`Fetched: ${cats.length} cats, ${subCats.length} subCats, ${childCats.length} childCats`);

        const allCategories = [...cats, ...subCats, ...childCats];
        const map = new Map();

        allCategories.forEach(c => {
            const id = String(c._id || c.id || "");
            if (id) map.set(id, { ...c, children: [] });
        });

        let linkCount = 0;

        allCategories.forEach(c => {
            const rawParent = c.parent || c.parentId || c.parent_id || c.category || c.subCategory || c.categoryId || c.subCategoryId || c.rootCategory;
            if (!rawParent) return;

            const parentId = typeof rawParent === 'object' ? String(rawParent._id || rawParent.id) : String(rawParent);

            // Checking the specific issue
            if (c.category) { // It is a subcat
                const pVal = c.category;
                console.log(`SubCat ${c._id} has category field:`, typeof pVal, pVal);
                console.log(`Extracted Parent ID: ${parentId}`);
                console.log(`Map has parent? ${map.has(parentId)}`);
            }

            if (map.has(parentId)) {
                const childId = String(c._id || c.id);
                const childNode = map.get(childId);
                const parentNode = map.get(parentId);

                if (childNode && parentNode) {
                    if (!parentNode.children.find((child) => String(child._id || child.id) === childId)) {
                        parentNode.children.push(childNode);
                        linkCount++;
                    }
                }
            } else {
                if (c.category) console.warn("ORPHAN SUBCAT:", c.name, "Parent ID:", parentId);
            }
        });

        console.log(`Total links established: ${linkCount}`);

        const roots = cats.map(c => map.get(String(c._id || c.id))).filter(Boolean);
        console.log("Roots count:", roots.length);

        const testRoot = roots.find(r => r._id === "693d966aad16f44eb4082598");
        if (testRoot) {
            console.log("Target Root children count:", testRoot.children.length);
        } else {
            console.log("Target Root NOT FOUND in roots list");
        }

    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) console.log(e.response.data);
    }
}
run();
